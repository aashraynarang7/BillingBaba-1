const OnlineStoreItem = require('../models/OnlineStoreItem');

// GET /api/online-store/items?companyId=
exports.getItems = async (req, res) => {
    try {
        const { companyId, category, search } = req.query;
        if (!companyId) return res.status(400).json({ message: 'companyId is required' });

        const filter = { companyId };
        if (category && category !== 'All') filter.category = category;
        if (search) filter.name = { $regex: search, $options: 'i' };

        const items = await OnlineStoreItem.find(filter)
            .sort({ createdAt: -1 })
            .lean();
        res.json(items);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// POST /api/online-store/items
exports.createItem = async (req, res) => {
    try {
        const item = new OnlineStoreItem({ ...req.body, updatedAt: new Date() });
        await item.save();
        res.status(201).json(item);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// POST /api/online-store/items/bulk-add  — add multiple inventory items to the store
exports.bulkAddFromInventory = async (req, res) => {
    try {
        const { companyId, items } = req.body;
        if (!companyId || !Array.isArray(items)) {
            return res.status(400).json({ message: 'companyId and items[] are required' });
        }
        const docs = items.map(item => ({
            companyId,
            inventoryItemId: item.inventoryItemId || null,
            name: item.name,
            itemCode: item.itemCode || '',
            unit: item.unit || 'PCS',
            category: item.category || '',
            description: item.description || '',
            inventoryPrice: item.inventoryPrice || 0,
            storePrice: item.storePrice || item.inventoryPrice || 0,
            isVisible: true,
            isInStock: true,
        }));
        const inserted = await OnlineStoreItem.insertMany(docs, { ordered: false });
        res.status(201).json(inserted);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// PUT /api/online-store/items/:id
exports.updateItem = async (req, res) => {
    try {
        const item = await OnlineStoreItem.findByIdAndUpdate(
            req.params.id,
            { ...req.body, updatedAt: new Date() },
            { new: true }
        );
        if (!item) return res.status(404).json({ message: 'Item not found' });
        res.json(item);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// DELETE /api/online-store/items/:id
exports.deleteItem = async (req, res) => {
    try {
        await OnlineStoreItem.findByIdAndDelete(req.params.id);
        res.json({ message: 'Deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// GET /api/online-store/categories?companyId=
exports.getCategories = async (req, res) => {
    try {
        const { companyId } = req.query;
        if (!companyId) return res.status(400).json({ message: 'companyId is required' });
        const categories = await OnlineStoreItem.distinct('category', { companyId, category: { $ne: '' } });
        res.json(categories);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
