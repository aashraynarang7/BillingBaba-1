// Looks up a barcode via Open Food Facts (free, no API key needed)
// Falls back to an empty result if not found — user can still add manually
const https = require('https');

const emptyResult = (code, error) => ({
    found: false,
    barcode: code || '',
    name: '',
    brand: '',
    category: '',
    description: '',
    imageUrl: '',
    quantity: '',
    unit: '',
    mrp: 0,
    ...(error ? { error } : {}),
});

// HTTPS GET that works on all Node versions (no native fetch needed)
function httpsGet(url) {
    return new Promise((resolve, reject) => {
        https.get(url, { headers: { 'User-Agent': 'BillingBaba/1.0' } }, (resp) => {
            let data = '';
            resp.on('data', chunk => { data += chunk; });
            resp.on('end', () => {
                try { resolve(JSON.parse(data)); }
                catch (e) { reject(new Error('Invalid JSON from API')); }
            });
        }).on('error', reject);
    });
}

exports.lookupBarcode = async (req, res) => {
    try {
        const { code } = req.params;
        if (!code) return res.status(400).json({ message: 'Barcode code is required' });

        const sanitized = code.replace(/[^a-zA-Z0-9]/g, '');
        const url = `https://world.openfoodfacts.org/api/v0/product/${sanitized}.json`;

        let data;
        try {
            data = await httpsGet(url);
        } catch (fetchErr) {
            // API unreachable — return empty so frontend can still do manual entry
            return res.json(emptyResult(sanitized, `API unreachable: ${fetchErr.message}`));
        }

        if (data.status === 1 && data.product) {
            const p = data.product;
            return res.json({
                found: true,
                barcode: sanitized,
                name: p.product_name || p.product_name_en || '',
                brand: p.brands || '',
                category: p.categories_tags?.[0]?.replace('en:', '') || '',
                description: p.generic_name || p.generic_name_en || '',
                imageUrl: p.image_front_small_url || p.image_url || '',
                quantity: p.quantity || '',
                unit: '',
                mrp: 0,
            });
        }

        res.json(emptyResult(sanitized));
    } catch (err) {
        res.json(emptyResult(req.params.code, err.message));
    }
};
