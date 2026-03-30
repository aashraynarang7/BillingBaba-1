// Looks up a barcode via Open Food Facts (free, no API key needed)
// Falls back to an empty result if not found — user can still add manually

exports.lookupBarcode = async (req, res) => {
    try {
        const { code } = req.params;
        if (!code) return res.status(400).json({ message: 'Barcode code is required' });

        const url = `https://world.openfoodfacts.org/api/v0/product/${code}.json`;
        const response = await fetch(url);
        const data = await response.json();

        if (data.status === 1 && data.product) {
            const p = data.product;
            return res.json({
                found: true,
                barcode: code,
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

        // Not found in Open Food Facts — return empty shell
        res.json({
            found: false,
            barcode: code,
            name: '',
            brand: '',
            category: '',
            description: '',
            imageUrl: '',
            quantity: '',
            unit: '',
            mrp: 0,
        });
    } catch (err) {
        // Network error or API down — still allow manual entry
        res.json({
            found: false,
            barcode: req.params.code || '',
            name: '',
            brand: '',
            category: '',
            description: '',
            imageUrl: '',
            quantity: '',
            unit: '',
            mrp: 0,
            error: err.message,
        });
    }
};
