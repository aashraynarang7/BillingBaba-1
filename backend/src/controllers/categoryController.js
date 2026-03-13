const Category = require('../models/Category');

exports.createCategory = async (req, res) => {
    try {
        const { name, companyId } = req.body;

        if (!name || !companyId) {
            return res.status(400).json({ error: 'Name and Company ID are required' });
        }

        const category = new Category({ name, companyId });
        await category.save();

        res.status(201).json(category);
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ error: 'Category already exists' });
        }
        res.status(400).json({ error: error.message });
    }
};

exports.getCategories = async (req, res) => {
    try {
        const { companyId } = req.query;

        if (!companyId || companyId === 'null' || companyId === 'undefined') {
            return res.json([]);
        }

        const categories = await Category.find({ companyId }).sort({ name: 1 });
        res.json(categories);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        await Category.findByIdAndDelete(id);
        res.json({ message: 'Category deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
