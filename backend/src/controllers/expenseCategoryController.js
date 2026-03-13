const ExpenseCategory = require('../models/ExpenseCategory');

exports.createExpenseCategory = async (req, res) => {
    try {
        const { name, companyId, expenseType } = req.body;
        if (!name || !companyId) {
            return res.status(400).json({ error: 'Name and companyId are required' });
        }
        const category = new ExpenseCategory({ name, companyId, expenseType });
        await category.save();
        res.status(201).json(category);
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ error: 'Expense category already exists' });
        }
        res.status(500).json({ error: error.message });
    }
};

exports.getExpenseCategories = async (req, res) => {
    try {
        const { companyId } = req.query;
        if (!companyId || companyId === 'null' || companyId === 'undefined') {
            return res.json([]);
        }
        const categories = await ExpenseCategory.find({ companyId }).sort({ name: 1 });
        res.json(categories);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteExpenseCategory = async (req, res) => {
    try {
        await ExpenseCategory.findByIdAndDelete(req.params.id);
        res.json({ message: 'Expense category deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
