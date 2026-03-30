const ItemSettings = require('../models/ItemSettings');

// GET /api/item-settings?companyId=...
exports.getItemSettings = async (req, res) => {
    try {
        const { companyId } = req.query;
        if (!companyId) return res.status(400).json({ message: 'companyId required' });

        // Return existing or create default on first fetch
        let settings = await ItemSettings.findOne({ companyId });
        if (!settings) {
            settings = await ItemSettings.create({ companyId });
        }
        res.json(settings);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// PUT /api/item-settings?companyId=...
exports.updateItemSettings = async (req, res) => {
    try {
        const { companyId } = req.query;
        if (!companyId) return res.status(400).json({ message: 'companyId required' });

        const update = { ...req.body, updatedAt: Date.now() };

        const settings = await ItemSettings.findOneAndUpdate(
            { companyId },
            { $set: update },
            { new: true, upsert: true, runValidators: true }
        );
        res.json(settings);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
