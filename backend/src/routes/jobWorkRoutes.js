const express = require('express');
const router = express.Router();
const JobWorkOut = require('../models/JobWorkOut');

router.get('/', async (req, res) => {
    try {
        const { companyId, startDate, endDate } = req.query;
        if (!companyId) return res.status(400).json({ error: 'companyId required' });
        const filter = { companyId };
        if (startDate || endDate) {
            filter.invoiceDate = {};
            if (startDate) filter.invoiceDate.$gte = new Date(startDate);
            if (endDate) filter.invoiceDate.$lte = new Date(endDate + 'T23:59:59');
        }
        const docs = await JobWorkOut.find(filter).sort({ invoiceDate: -1 }).lean();
        res.json(docs);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
