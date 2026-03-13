const Party = require('../models/Party');

const GST_STATE_CODES = {
    '01': 'Jammu & Kashmir', '02': 'Himachal Pradesh', '03': 'Punjab', '04': 'Chandigarh',
    '05': 'Uttarakhand', '06': 'Haryana', '07': 'Delhi', '08': 'Rajasthan',
    '09': 'Uttar Pradesh', '10': 'Bihar', '11': 'Sikkim', '12': 'Arunachal Pradesh',
    '13': 'Nagaland', '14': 'Manipur', '15': 'Mizoram', '16': 'Tripura',
    '17': 'Meghalaya', '18': 'Assam', '19': 'West Bengal', '20': 'Jharkhand',
    '21': 'Odisha', '22': 'Chhattisgarh', '23': 'Madhya Pradesh', '24': 'Gujarat',
    '26': 'Dadra and Nagar Haveli and Daman and Diu', '27': 'Maharashtra', '29': 'Karnataka',
    '30': 'Goa', '31': 'Lakshadweep', '32': 'Kerala', '33': 'Tamil Nadu',
    '34': 'Puducherry', '35': 'Andaman & Nicobar Islands', '36': 'Telangana',
    '37': 'Andhra Pradesh', '38': 'Ladakh'
};

const validateAndProcessGst = (partyData) => {
    if (partyData.gstin && partyData.gstin.trim() !== '') {
        const gstin = partyData.gstin.trim().toUpperCase();
        partyData.gstin = gstin;

        const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
        if (!gstRegex.test(gstin)) {
            throw new Error('Invalid GSTIN format');
        }

        const stateCode = gstin.substring(0, 2);
        if (GST_STATE_CODES[stateCode]) {
            partyData.state = GST_STATE_CODES[stateCode];
            if (!partyData.gstType || partyData.gstType === 'Unregistered/Consumer') {
                partyData.gstType = 'Registered Regular';
            }
        }
    }
};

exports.createParty = async (req, res) => {
    try {
        const partyData = req.body;

        // --- HANDLE FILE UPLOADS ---
        if (req.files) {
            if (req.files.image && req.files.image[0]) {
                partyData.image = `/uploads/${req.files.image[0].filename}`;
            }
        }

        // Parse nested JSON maps or objects if any (e.g. additionalFields)
        if (partyData.additionalFields && typeof partyData.additionalFields === 'string') {
            try { partyData.additionalFields = JSON.parse(partyData.additionalFields); } catch (e) { }
        }

        // --- GST Validation & State Mapping ---
        validateAndProcessGst(partyData);

        // Initialize currentBalance with openingBalance
        if (partyData.openingBalance !== undefined) {
            partyData.currentBalance = Number(partyData.openingBalance) || 0;
        }

        const party = new Party(partyData);
        await party.save();
        res.status(201).json(party);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getParties = async (req, res) => {
    try {
        const { companyId, search } = req.query;
        const filter = {};
        if (companyId) filter.companyId = companyId;

        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: 'i' } },
                { phone: { $regex: search, $options: 'i' } }
            ];
        }

        const parties = await Party.find(filter).sort({ name: 1 });
        // const parties = await Party.find()
        // console.log(parties)
        res.json(parties);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getPartyById = async (req, res) => {
    try {
        const party = await Party.findById(req.params.id);
        if (!party) return res.status(404).json({ message: 'Party not found' });
        res.json(party);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateParty = async (req, res) => {
    try {
        const updateData = req.body;

        // --- HANDLE FILE UPLOADS ---
        if (req.files) {
            if (req.files.image && req.files.image[0]) {
                updateData.image = `/uploads/${req.files.image[0].filename}`;
            }
        }

        const existingParty = await Party.findById(req.params.id);
        if (!existingParty) return res.status(404).json({ message: 'Party not found' });

        // Parse nested JSON maps or objects if any (e.g. additionalFields)
        if (updateData.additionalFields && typeof updateData.additionalFields === 'string') {
            try { updateData.additionalFields = JSON.parse(updateData.additionalFields); } catch (e) { }
        }

        // --- GST Validation & State Mapping ---
        validateAndProcessGst(updateData);

        // Adjust currentBalance if openingBalance changes
        if (updateData.openingBalance !== undefined) {
            const diff = Number(updateData.openingBalance) - (existingParty.openingBalance || 0);
            updateData.currentBalance = (existingParty.currentBalance || 0) + diff;
        }

        const party = await Party.findByIdAndUpdate(req.params.id, updateData, { new: true });
        res.json(party);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.deleteParty = async (req, res) => {
    try {
        const party = await Party.findByIdAndDelete(req.params.id);
        if (!party) return res.status(404).json({ message: 'Party not found' });
        res.json({ message: 'Party deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getPartyTransactions = async (req, res) => {
    try {
        const { id } = req.params;
        const { companyId } = req.query;

        const party = await Party.findById(id);
        if (!party) return res.status(404).json({ message: 'Party not found' });

        const query = { partyId: id };
        if (companyId) {
            query.companyId = companyId;
        }

        // Models to query
        const SaleInvoice = require('../models/SaleInvoice');
        const SaleOrder = require('../models/SaleOrder');
        const ProformaInvoice = require('../models/ProformaInvoice');
        const Estimate = require('../models/Estimate');
        const DeliveryChallan = require('../models/DeliveryChallan');
        const CreditNote = require('../models/CreditNote');
        const Purchase = require('../models/Purchase');
        const DebitNote = require('../models/DebitNote');

        // Note: For actual payment tracking we need to query the models saving the payments, 
        // assuming standard sales & purchases first.

        // Parallel Fetch
        const [
            invoices,
            orders,
            proformas,
            estimates,
            challans,
            creditNotes,
            purchases,
            debitNotes
        ] = await Promise.all([
            SaleInvoice.find(query).lean(),
            SaleOrder.find(query).lean(),
            ProformaInvoice.find(query).lean(),
            Estimate.find(query).lean(),
            DeliveryChallan.find(query).lean(),
            CreditNote.find(query).lean(),
            Purchase.find(query).lean(),
            DebitNote.find(query).lean()
        ]);

        const allTransactions = [];

        // Helper to process list
        const processList = (list, typeLabel, dateField, numField, category) => {
            list.forEach(doc => {
                allTransactions.push({
                    id: doc._id,
                    type: typeLabel,
                    rawType: doc.documentType || typeLabel,
                    number: doc[numField] || doc.receiptNumber || '-',
                    date: doc[dateField] || doc.createdAt,
                    amount: doc.grandTotal || 0,
                    balance: doc.balanceDue || 0,
                    status: doc.status || 'Generated',
                    category: category,
                    paymentMode: doc.paymentType || doc.paymentMode || 'Cash'
                });
            });
        };

        // --- MAP SALES ---
        processList(invoices, 'Sale Invoice', 'invoiceDate', 'invoiceNumber', 'Sale');
        processList(orders, 'Sale Order', 'orderDate', 'orderNumber', 'Sale');
        processList(proformas, 'Proforma Invoice', 'invoiceDate', 'refNo', 'Sale');
        processList(estimates, 'Estimate', 'invoiceDate', 'refNo', 'Sale');
        processList(challans, 'Delivery Challan', 'challanDate', 'challanNumber', 'Sale');
        processList(creditNotes, 'Credit Note', 'creditNoteDate', 'returnNo', 'Sale Return / Credit Note');

        // --- MAP PURCHASES ---
        purchases.forEach(doc => {
            let type = 'Purchase Bill';
            let dateField = 'billDate';
            let numField = 'billNumber';

            if (doc.documentType === 'PO') {
                type = 'Purchase Order';
                dateField = 'orderDate';
                numField = 'orderNumber';
            } else if (doc.documentType === 'EXPENSE') {
                type = 'Expense';
                dateField = 'billDate';
                numField = 'billNumber';
            } else if (doc.documentType === 'FA') {
                type = 'Purchase Fixed Asset';
                dateField = 'billDate';
                numField = 'billNumber';
            } else if (doc.isReturn) {
                type = 'Purchase Return / Debit Note';
            }

            allTransactions.push({
                id: doc._id,
                type: type,
                rawType: doc.documentType,
                number: doc[numField] || '-',
                date: doc[dateField] || doc.createdAt,
                amount: doc.grandTotal || 0,
                balance: doc.balanceDue || 0,
                status: doc.status || 'Received',
                category: 'Purchase',
                paymentMode: doc.paymentType || 'Cash'
            });
        });

        processList(debitNotes, 'Debit Note', 'debitNoteDate', 'returnNo', 'Purchase Return / Debit Note');

        // Sort by date desc
        allTransactions.sort((a, b) => new Date(b.date) - new Date(a.date));

        res.json(allTransactions);

    } catch (error) {
        console.error('Transactions fetch error:', error);
        res.status(500).json({ error: error.message });
    }
};
