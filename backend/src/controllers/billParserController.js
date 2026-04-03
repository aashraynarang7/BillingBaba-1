const http = require('http');
const fs = require('fs');
const path = require('path');

const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434';
const VISION_MODEL = process.env.OLLAMA_VISION_MODEL || 'llava';

// Send a request to Ollama API
function ollamaGenerate(model, prompt, imageBase64) {
    return new Promise((resolve, reject) => {
        const body = JSON.stringify({
            model,
            prompt,
            images: imageBase64 ? [imageBase64] : [],
            stream: false,
        });

        const url = new URL(`${OLLAMA_URL}/api/generate`);
        const options = {
            hostname: url.hostname,
            port: url.port,
            path: url.pathname,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(body),
            },
        };

        const req = http.request(options, (resp) => {
            let data = '';
            resp.on('data', (chunk) => { data += chunk; });
            resp.on('end', () => {
                try {
                    const parsed = JSON.parse(data);
                    resolve(parsed);
                } catch (e) {
                    reject(new Error('Invalid JSON from Ollama: ' + data.slice(0, 200)));
                }
            });
        });

        req.on('error', (err) => reject(err));
        req.setTimeout(120000, () => {
            req.destroy();
            reject(new Error('Ollama request timed out (120s)'));
        });

        req.write(body);
        req.end();
    });
}

// Extract JSON from Ollama's text response (it often wraps in markdown code blocks)
function extractJSON(text) {
    // Try to find JSON in code blocks first
    const codeBlockMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (codeBlockMatch) {
        try { return JSON.parse(codeBlockMatch[1].trim()); } catch (e) { /* fall through */ }
    }

    // Try to find a JSON object directly
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
        try { return JSON.parse(jsonMatch[0]); } catch (e) { /* fall through */ }
    }

    return null;
}

const EXTRACTION_PROMPT = `You are a bill/invoice data extraction assistant. Analyze this purchase bill/invoice image and extract the following information as a JSON object.

Extract:
- partyName: the vendor/supplier name
- phone: vendor phone number if visible
- billNumber: the invoice/bill number
- billDate: the date on the bill (format: YYYY-MM-DD)
- stateOfSupply: the state mentioned on the bill
- items: an array of items, each with:
  - name: item name/description
  - quantity: number quantity
  - unit: unit of measurement (PCS, KG, etc.)
  - pricePerUnit: price per unit (number)
  - discountPercent: discount percentage if any (number, default 0)
  - taxRate: tax/GST rate percentage if any (number, default 0)
  - amount: total amount for this line item (number)
- subTotal: subtotal before tax/discount
- totalDiscount: total discount amount
- totalTax: total tax amount
- grandTotal: final total amount
- description: any additional notes on the bill

If a field is not visible or unclear, use an empty string for text fields and 0 for number fields. Return ONLY valid JSON, no extra text.

JSON:`;

exports.parseBillImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No image file uploaded' });
        }

        const filePath = req.file.path;
        const imageBuffer = fs.readFileSync(filePath);
        const imageBase64 = imageBuffer.toString('base64');

        let result;
        try {
            result = await ollamaGenerate(VISION_MODEL, EXTRACTION_PROMPT, imageBase64);
        } catch (err) {
            // Clean up uploaded file
            fs.unlink(filePath, () => {});

            if (err.message.includes('ECONNREFUSED')) {
                return res.status(503).json({
                    message: 'Ollama is not running. Please start Ollama with a vision model (e.g., "ollama run llava").',
                    setup: {
                        step1: 'Install Ollama from https://ollama.com',
                        step2: 'Run: ollama pull llava',
                        step3: 'Start: ollama serve',
                    }
                });
            }
            return res.status(500).json({ message: `AI processing failed: ${err.message}` });
        }

        // Clean up uploaded file after processing
        fs.unlink(filePath, () => {});

        const responseText = result.response || '';
        const extracted = extractJSON(responseText);

        if (!extracted) {
            return res.status(422).json({
                message: 'Could not parse structured data from the bill. Try a clearer image.',
                rawResponse: responseText.slice(0, 500),
            });
        }

        // Normalize the extracted data to match Purchase model schema
        const normalized = {
            partyName: extracted.partyName || '',
            phone: extracted.phone || '',
            billNumber: extracted.billNumber || '',
            billDate: extracted.billDate || new Date().toISOString().split('T')[0],
            stateOfSupply: extracted.stateOfSupply || '',
            description: extracted.description || '',
            items: (extracted.items || []).map((item) => ({
                name: item.name || 'Unknown Item',
                quantity: Number(item.quantity) || 1,
                unit: item.unit || 'PCS',
                priceUnit: {
                    amount: Number(item.pricePerUnit) || 0,
                    taxType: 'withoutTax',
                },
                discount: {
                    percent: Number(item.discountPercent) || 0,
                    amount: 0,
                },
                tax: {
                    rate: Number(item.taxRate) || 0,
                    amount: 0,
                },
                amount: Number(item.amount) || 0,
            })),
            subTotal: Number(extracted.subTotal) || 0,
            totalDiscount: Number(extracted.totalDiscount) || 0,
            totalTax: Number(extracted.totalTax) || 0,
            grandTotal: Number(extracted.grandTotal) || 0,
        };

        // Recalculate discount and tax amounts for each item
        normalized.items.forEach((item) => {
            const base = item.priceUnit.amount * item.quantity;
            item.discount.amount = base * (item.discount.percent / 100);
            const afterDiscount = base - item.discount.amount;
            item.tax.amount = afterDiscount * (item.tax.rate / 100);
            if (!item.amount) {
                item.amount = afterDiscount + item.tax.amount;
            }
        });

        res.json({
            success: true,
            data: normalized,
            model: VISION_MODEL,
        });
    } catch (err) {
        res.status(500).json({ message: `Server error: ${err.message}` });
    }
};

// Check if Ollama is running and has the vision model
exports.checkOllamaStatus = async (req, res) => {
    try {
        const result = await new Promise((resolve, reject) => {
            const url = new URL(`${OLLAMA_URL}/api/tags`);
            http.get({ hostname: url.hostname, port: url.port, path: url.pathname }, (resp) => {
                let data = '';
                resp.on('data', (chunk) => { data += chunk; });
                resp.on('end', () => {
                    try { resolve(JSON.parse(data)); }
                    catch (e) { reject(new Error('Invalid response')); }
                });
            }).on('error', reject);
        });

        const models = (result.models || []).map((m) => m.name);
        const hasVisionModel = models.some((m) =>
            m.startsWith('llava') || m.startsWith('llama3.2-vision') || m.startsWith('bakllava')
        );

        res.json({
            running: true,
            models,
            hasVisionModel,
            recommendedModel: VISION_MODEL,
        });
    } catch (err) {
        res.json({
            running: false,
            models: [],
            hasVisionModel: false,
            error: err.message,
            setup: {
                step1: 'Install Ollama from https://ollama.com',
                step2: `Run: ollama pull ${VISION_MODEL}`,
                step3: 'Start: ollama serve',
            },
        });
    }
};
