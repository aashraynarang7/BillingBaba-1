const PaymentIn = require('../models/PaymentIn');
const Party = require('../models/Party');

const SaleInvoice = require('../models/SaleInvoice');
const mongoose = require('mongoose');

// Create Payment In
exports.createPaymentIn = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const paymentData = req.body;
        const { companyId, partyId, receiptNo, date, amount, paymentMode, description, linkedInvoices, godown } = paymentData;

        // --- HANDLE FILE UPLOADS ---
        let images = [];
        if (req.files && req.files.images) {
            images = req.files.images.map(f => `/uploads/${f.filename}`);
        }

        // Parse linkedInvoices if stringified
        let parsedLinkedInvoices = linkedInvoices;
        if (typeof linkedInvoices === 'string') {
            try { parsedLinkedInvoices = JSON.parse(linkedInvoices); } catch (e) { }
        }

        // 1. Create Payment Record
        const payment = new PaymentIn({
            companyId,
            partyId,
            receiptNo,
            date,
            amount,
            paymentMode,
            description,
            images,
            linkedInvoices: parsedLinkedInvoices || [],
            godown,
            createdBy: req.user ? req.user.id : undefined
        });

        await payment.save({ session });

        // 2. Update Party Balance (Decrease balance for Payment In)
        const party = await Party.findById(partyId).session(session);
        if (party) {
            party.currentBalance = (party.currentBalance || 0) - Number(amount);
            await party.save({ session });
        }

        // 3. Update Linked Invoices (if any)
        if (linkedInvoices && linkedInvoices.length > 0) {
            for (const link of linkedInvoices) {
                const { invoiceId, amountSettled } = link;
                const sale = await SaleInvoice.findById(invoiceId).session(session);
                if (sale) {
                    sale.receivedAmount = (sale.receivedAmount || 0) + Number(amountSettled);
                    sale.balanceDue = (sale.balanceDue || 0) - Number(amountSettled);
                    if (sale.balanceDue <= 0.01) { // Floating point tolerance
                        sale.balanceDue = 0;
                        sale.isPaid = true;
                        sale.status = 'Paid';
                    } else {
                        sale.isPaid = false;
                        const now = new Date();
                        if (sale.dueDate && new Date(sale.dueDate) < now) {
                            sale.status = 'Overdue';
                        } else if (sale.balanceDue < sale.grandTotal) {
                            sale.status = 'Partial';
                        } else {
                            sale.status = 'Unpaid';
                        }
                    }

                    // Optional: Ensure balance doesn't go below zero if logic allows
                    // if (sale.balanceDue < 0) sale.balanceDue = 0; 

                    // Track this payment inside the SaleInvoice history
                    sale.paymentHistory.push({
                        date: date || Date.now(),
                        amount: Number(amountSettled),
                        paymentMode: paymentMode || 'Cash',
                        notes: `Receipt No: ${receiptNo || '-'}`
                    });

                    await sale.save({ session });
                }
            }
        }

        await session.commitTransaction();
        session.endSession();

        res.status(201).json(payment);
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.error('Error creating Payment In:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Get All Payment In Records
exports.getPaymentIn = async (req, res) => {
    try {
        const { companyId, startDate, endDate, userId } = req.query;
        let query = {};
        if (companyId) {
            query.companyId = companyId;
        }

        // Date Filter
        if (startDate && endDate) {
            query.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
        }

        // User Filter
        if (userId) {
            query.createdBy = userId;
        }

        // Godown Filter
        if (req.query.godown) {
            query.godown = req.query.godown;
        }

        const payments = await PaymentIn.find(query)
            .populate('partyId', 'name phone')
            .populate('createdBy', 'name')
            .sort({ date: -1 });

        res.status(200).json(payments);
    } catch (error) {
        console.error('Error fetching Payment In records:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Get Single Payment In
exports.getPaymentInById = async (req, res) => {
    try {
        const payment = await PaymentIn.findById(req.params.id).populate('partyId');
        if (!payment) {
            return res.status(404).json({ message: 'Payment not found' });
        }
        res.status(200).json(payment);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// Update Payment In
exports.updatePaymentIn = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const payment = await PaymentIn.findById(req.params.id).session(session);
        if (!payment) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({ message: 'Payment not found' });
        }

        const { amount, paymentMode, date, description, receiptNo, linkedInvoices } = req.body;

        // Parse linkedInvoices if stringified
        let newLinkedInvoices = linkedInvoices;
        if (typeof linkedInvoices === 'string') {
            try { newLinkedInvoices = JSON.parse(linkedInvoices); } catch (e) { }
        }
        newLinkedInvoices = newLinkedInvoices || payment.linkedInvoices;

        const oldAmount = payment.amount;
        const newAmount = amount !== undefined ? Number(amount) : oldAmount;

        // --- REVERT old linked invoice effects ---
        for (const link of payment.linkedInvoices) {
            const sale = await SaleInvoice.findById(link.invoiceId).session(session);
            if (sale) {
                sale.receivedAmount = Math.max(0, (sale.receivedAmount || 0) - Number(link.amountSettled));
                sale.balanceDue = (sale.balanceDue || 0) + Number(link.amountSettled);
                sale.isPaid = false;
                // Remove matching paymentHistory entry
                sale.paymentHistory = sale.paymentHistory.filter(
                    h => !(h.notes && h.notes.includes(payment.receiptNo))
                );
                const now = new Date();
                if (sale.dueDate && new Date(sale.dueDate) < now && sale.balanceDue > 0) {
                    sale.status = 'Overdue';
                } else if (sale.balanceDue < sale.grandTotal) {
                    sale.status = 'Partial';
                } else {
                    sale.status = 'Unpaid';
                }
                await sale.save({ session });
            }
        }

        // --- REVERT old party balance effect ---
        if (payment.partyId) {
            await Party.findByIdAndUpdate(
                payment.partyId,
                { $inc: { currentBalance: oldAmount } },
                { session }
            );
        }

        // --- APPLY new linked invoice effects ---
        for (const link of newLinkedInvoices) {
            const sale = await SaleInvoice.findById(link.invoiceId).session(session);
            if (sale) {
                sale.receivedAmount = (sale.receivedAmount || 0) + Number(link.amountSettled);
                sale.balanceDue = (sale.balanceDue || 0) - Number(link.amountSettled);
                if (sale.balanceDue <= 0.01) {
                    sale.balanceDue = 0;
                    sale.isPaid = true;
                    sale.status = 'Paid';
                } else {
                    sale.isPaid = false;
                    const now = new Date();
                    if (sale.dueDate && new Date(sale.dueDate) < now) {
                        sale.status = 'Overdue';
                    } else if (sale.balanceDue < sale.grandTotal) {
                        sale.status = 'Partial';
                    } else {
                        sale.status = 'Unpaid';
                    }
                }
                sale.paymentHistory.push({
                    date: date || Date.now(),
                    amount: Number(link.amountSettled),
                    paymentMode: paymentMode || payment.paymentMode || 'Cash',
                    notes: `Receipt No: ${receiptNo || payment.receiptNo || '-'}`
                });
                await sale.save({ session });
            }
        }

        // --- APPLY new party balance effect ---
        if (payment.partyId) {
            await Party.findByIdAndUpdate(
                payment.partyId,
                { $inc: { currentBalance: -newAmount } },
                { session }
            );
        }

        // Update payment fields
        if (amount !== undefined) payment.amount = newAmount;
        if (paymentMode !== undefined) payment.paymentMode = paymentMode;
        if (date !== undefined) payment.date = date;
        if (description !== undefined) payment.description = description;
        if (receiptNo !== undefined) payment.receiptNo = receiptNo;
        payment.linkedInvoices = newLinkedInvoices;

        await payment.save({ session });
        await session.commitTransaction();
        session.endSession();
        res.json(payment);
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.error('Error updating Payment In:', error);
        res.status(500).json({ message: error.message || 'Server Error' });
    }
};

// Delete Payment In
exports.deletePaymentIn = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const payment = await PaymentIn.findById(req.params.id).session(session);
        if (!payment) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({ message: 'Payment not found' });
        }

        // --- REVERT linked invoice effects ---
        for (const link of payment.linkedInvoices) {
            const sale = await SaleInvoice.findById(link.invoiceId).session(session);
            if (sale) {
                sale.receivedAmount = Math.max(0, (sale.receivedAmount || 0) - Number(link.amountSettled));
                sale.balanceDue = (sale.balanceDue || 0) + Number(link.amountSettled);
                sale.isPaid = false;
                sale.paymentHistory = sale.paymentHistory.filter(
                    h => !(h.notes && h.notes.includes(payment.receiptNo))
                );
                const now = new Date();
                if (sale.dueDate && new Date(sale.dueDate) < now && sale.balanceDue > 0) {
                    sale.status = 'Overdue';
                } else if (sale.balanceDue < sale.grandTotal) {
                    sale.status = 'Partial';
                } else {
                    sale.status = 'Unpaid';
                }
                await sale.save({ session });
            }
        }

        // --- REVERT party balance ---
        if (payment.partyId) {
            await Party.findByIdAndUpdate(
                payment.partyId,
                { $inc: { currentBalance: Number(payment.amount) } },
                { session }
            );
        }

        await PaymentIn.findByIdAndDelete(req.params.id).session(session);
        await session.commitTransaction();
        session.endSession();
        res.json({ message: 'Payment deleted successfully' });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.error('Error deleting Payment In:', error);
        res.status(500).json({ message: error.message || 'Server Error' });
    }
};
