const ExpenseItem = require('../models/ExpenseItem');

exports.createExpenseItem = async (req, res) => {
    try {
        const { name, companyId, hsnSac, description, price, taxType, taxRate } = req.body;
        if (!name || !companyId) {
            return res.status(400).json({ error: 'Name and companyId are required' });
        }
        const item = new ExpenseItem({ name, companyId, hsnSac, description, price, taxType, taxRate });
        await item.save();
        res.status(201).json(item);
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ error: 'Expense item with this name already exists' });
        }
        res.status(500).json({ error: error.message });
    }
};

exports.getExpenseItems = async (req, res) => {
    try {
        const { companyId, search } = req.query;
        if (!companyId || companyId === 'null' || companyId === 'undefined') {
            return res.json([]);
        }
        const query = { companyId };
        if (search) query.name = { $regex: search, $options: 'i' };
        const items = await ExpenseItem.find(query).sort({ name: 1 });
        res.json(items);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateExpenseItem = async (req, res) => {
    try {
        const { name, hsnSac, description, price, taxType, taxRate } = req.body;
        const item = await ExpenseItem.findByIdAndUpdate(
            req.params.id,
            { name, hsnSac, description, price, taxType, taxRate },
            { new: true, runValidators: true }
        );
        if (!item) return res.status(404).json({ error: 'Expense item not found' });
        res.json(item);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteExpenseItem = async (req, res) => {
    try {
        await ExpenseItem.findByIdAndDelete(req.params.id);
        res.json({ message: 'Expense item deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
