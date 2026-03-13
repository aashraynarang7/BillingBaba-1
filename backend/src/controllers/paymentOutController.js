const PaymentOut = require('../models/PaymentOut');
const Party = require('../models/Party');
const Purchase = require('../models/Purchase');
const mongoose = require('mongoose');

// ── Helpers ────────────────────────────────────────────────────────────────────

function calcPurchaseStatus(purchase) {
    if ((purchase.balanceDue || 0) <= 0.01) return 'Paid';
    if ((purchase.paidAmount || 0) > 0) {
        if (purchase.dueDate && new Date(purchase.dueDate) < new Date()) return 'Overdue';
        return 'Partial';
    }
    if (purchase.dueDate && new Date(purchase.dueDate) < new Date()) return 'Overdue';
    return 'Unpaid';
}

async function applyPurchasePayment(purchase, amountSettled, date, paymentMode, receiptNo, session) {
    purchase.paidAmount = (purchase.paidAmount || 0) + Number(amountSettled);
    purchase.balanceDue = Math.max(0, (purchase.balanceDue || 0) - Number(amountSettled));
    purchase.status = calcPurchaseStatus(purchase);
    purchase.paymentHistory.push({
        date: date || Date.now(),
        amount: Number(amountSettled),
        paymentMode: paymentMode || 'Cash',
        notes: `Voucher No: ${receiptNo || '-'}`
    });
    await purchase.save({ session });
}

async function revertPurchasePayment(purchase, amountSettled, receiptNo, session) {
    purchase.paidAmount = Math.max(0, (purchase.paidAmount || 0) - Number(amountSettled));
    purchase.balanceDue = (purchase.balanceDue || 0) + Number(amountSettled);
    purchase.paymentHistory = purchase.paymentHistory.filter(
        h => !(h.notes && h.notes.includes(receiptNo))
    );
    purchase.status = calcPurchaseStatus(purchase);
    await purchase.save({ session });
}

// ── Create ─────────────────────────────────────────────────────────────────────

exports.createPaymentOut = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const { companyId, partyId, receiptNo, date, amount, paymentMode, description, linkedPurchases } = req.body;

        let images = [];
        if (req.files && req.files.images) {
            images = req.files.images.map(f => `/uploads/${f.filename}`);
        }

        let parsedLinkedPurchases = linkedPurchases;
        if (typeof linkedPurchases === 'string') {
            try { parsedLinkedPurchases = JSON.parse(linkedPurchases); } catch (e) { }
        }

        const payment = new PaymentOut({
            companyId, partyId, receiptNo, date, amount, paymentMode, description, images,
            linkedPurchases: parsedLinkedPurchases || []
        });
        await payment.save({ session });

        // Party balance: decrease payable
        if (partyId) {
            await Party.findByIdAndUpdate(partyId, { $inc: { currentBalance: -Number(amount) } }, { session });
        }

        // Update each linked purchase
        if (parsedLinkedPurchases && parsedLinkedPurchases.length > 0) {
            for (const link of parsedLinkedPurchases) {
                const purchase = await Purchase.findById(link.purchaseId).session(session);
                if (purchase) {
                    await applyPurchasePayment(purchase, link.amountSettled, date, paymentMode, receiptNo, session);
                }
            }
        }

        await session.commitTransaction();
        session.endSession();
        res.status(201).json(payment);
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.error('Error creating Payment Out:', error);
        res.status(500).json({ message: error.message || 'Server Error' });
    }
};

// ── Get All ────────────────────────────────────────────────────────────────────

exports.getPaymentOut = async (req, res) => {
    try {
        const { companyId, startDate, endDate } = req.query;
        const query = {};
        if (companyId) query.companyId = companyId;
        if (startDate && endDate) {
            query.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
        }
        const payments = await PaymentOut.find(query)
            .populate('partyId', 'name phone')
            .sort({ date: -1 });
        res.status(200).json(payments);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// ── Get One ────────────────────────────────────────────────────────────────────

exports.getPaymentOutById = async (req, res) => {
    try {
        const payment = await PaymentOut.findById(req.params.id).populate('partyId');
        if (!payment) return res.status(404).json({ message: 'Payment not found' });
        res.status(200).json(payment);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// ── Update ─────────────────────────────────────────────────────────────────────

exports.updatePaymentOut = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const payment = await PaymentOut.findById(req.params.id).session(session);
        if (!payment) {
            await session.abortTransaction(); session.endSession();
            return res.status(404).json({ message: 'Payment not found' });
        }

        const { amount, paymentMode, date, description, receiptNo, linkedPurchases } = req.body;

        let newLinkedPurchases = linkedPurchases;
        if (typeof linkedPurchases === 'string') {
            try { newLinkedPurchases = JSON.parse(linkedPurchases); } catch (e) { }
        }
        newLinkedPurchases = newLinkedPurchases || payment.linkedPurchases;

        const oldAmount = payment.amount;
        const newAmount = amount !== undefined ? Number(amount) : oldAmount;

        // Revert old linked purchase effects
        for (const link of payment.linkedPurchases) {
            const purchase = await Purchase.findById(link.purchaseId).session(session);
            if (purchase) await revertPurchasePayment(purchase, link.amountSettled, payment.receiptNo, session);
        }

        // Revert old party balance
        if (payment.partyId) {
            await Party.findByIdAndUpdate(payment.partyId, { $inc: { currentBalance: oldAmount } }, { session });
        }

        // Apply new linked purchase effects
        const effectiveReceiptNo = receiptNo || payment.receiptNo;
        const effectivePaymentMode = paymentMode || payment.paymentMode;
        for (const link of newLinkedPurchases) {
            const purchase = await Purchase.findById(link.purchaseId).session(session);
            if (purchase) await applyPurchasePayment(purchase, link.amountSettled, date, effectivePaymentMode, effectiveReceiptNo, session);
        }

        // Apply new party balance
        if (payment.partyId) {
            await Party.findByIdAndUpdate(payment.partyId, { $inc: { currentBalance: -newAmount } }, { session });
        }

        // Update payment fields
        if (amount !== undefined) payment.amount = newAmount;
        if (paymentMode !== undefined) payment.paymentMode = paymentMode;
        if (date !== undefined) payment.date = date;
        if (description !== undefined) payment.description = description;
        if (receiptNo !== undefined) payment.receiptNo = receiptNo;
        payment.linkedPurchases = newLinkedPurchases;

        await payment.save({ session });
        await session.commitTransaction();
        session.endSession();
        res.json(payment);
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.error('Error updating Payment Out:', error);
        res.status(500).json({ message: error.message || 'Server Error' });
    }
};

// ── Delete ─────────────────────────────────────────────────────────────────────

exports.deletePaymentOut = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const payment = await PaymentOut.findById(req.params.id).session(session);
        if (!payment) {
            await session.abortTransaction(); session.endSession();
            return res.status(404).json({ message: 'Payment not found' });
        }

        // Revert linked purchase effects
        for (const link of payment.linkedPurchases) {
            const purchase = await Purchase.findById(link.purchaseId).session(session);
            if (purchase) await revertPurchasePayment(purchase, link.amountSettled, payment.receiptNo, session);
        }

        // Revert party balance
        if (payment.partyId) {
            await Party.findByIdAndUpdate(payment.partyId, { $inc: { currentBalance: Number(payment.amount) } }, { session });
        }

        await PaymentOut.findByIdAndDelete(req.params.id).session(session);
        await session.commitTransaction();
        session.endSession();
        res.json({ message: 'Payment deleted successfully' });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.error('Error deleting Payment Out:', error);
        res.status(500).json({ message: error.message || 'Server Error' });
    }
};
