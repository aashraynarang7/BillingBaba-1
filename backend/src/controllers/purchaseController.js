const Purchase = require('../models/Purchase');
const Item = require('../models/Item');
const Product = require('../models/Product');
const Party = require('../models/Party');

const DebitNote = require('../models/DebitNote');
const PaymentOut = require('../models/PaymentOut');

exports.createPurchase = async (req, res) => {
    const session = await Purchase.startSession();
    session.startTransaction();
    try {
        const purchaseData = req.body;

        // --- HANDLE FILE UPLOADS ---
        if (req.files) {
            if (req.files.images) {
                purchaseData.images = req.files.images.map(f => `/uploads/${f.filename}`);
            }
            if (req.files.documents) {
                purchaseData.documents = req.files.documents.map(f => `/uploads/${f.filename}`);
            }
        }

        // Parse nested JSON fields
        ['items', 'discount', 'tax', 'priceUnit'].forEach(field => {
            if (typeof purchaseData[field] === 'string') {
                try {
                    purchaseData[field] = JSON.parse(purchaseData[field]);
                } catch (e) { }
            }
        });

        if (purchaseData.documentType === 'DEBIT_NOTE') {
            // --- CREATE DEBIT NOTE ---
            delete purchaseData.documentType;

            if (!purchaseData.returnNo) {
                const last = await DebitNote.findOne({ companyId: purchaseData.companyId }).sort({ createdAt: -1 });
                let nextNum = 1;
                if (last && last.returnNo) {
                    const parts = last.returnNo.split('-');
                    const lastNum = parseInt(parts[parts.length - 1]);
                    if (!isNaN(lastNum)) nextNum = lastNum + 1;
                }
                purchaseData.returnNo = `${nextNum}`;
            }

            const debitNote = new DebitNote(purchaseData);
            await debitNote.save({ session });

            // Effect 1: Decrease Stock (Goods returned to supplier)
            if (debitNote.items && debitNote.items.length > 0) {
                for (const lineItem of debitNote.items) {
                    if (lineItem.itemId) {
                        const itemDoc = await Item.findById(lineItem.itemId).session(session);
                        if (itemDoc && itemDoc.type === 'product' && itemDoc.product) {
                            const qty = Number(lineItem.quantity);
                            // Debit Note -> Decrease Stock 
                            await Product.findByIdAndUpdate(itemDoc.product, { $inc: { 'currentQuantity': -qty } }, { session });
                        }
                    }
                }
            }

            // Effect 2: Update Party Balance (Decrease Payable)
            if (debitNote.partyId) {
                const amount = Number(debitNote.grandTotal) || 0;
                // Debit Note reduces what we owe to the supplier.
                // Assuming positive balance means we owe them (Payable).
                await Party.findByIdAndUpdate(debitNote.partyId, { $inc: { currentBalance: -amount } }, { session });
            }

            await session.commitTransaction();
            session.endSession();
            return res.status(201).json(debitNote);

        } else {
            // Auto-set isBill based on documentType or use default
            if (purchaseData.documentType === 'PO') {
                purchaseData.isBill = false;
            } else if (purchaseData.documentType === 'FA') {
                purchaseData.isBill = true;
            } else if (purchaseData.documentType === 'EXPENSE') {
                purchaseData.isBill = true;
                purchaseData.status = 'Paid';
            } else {
                purchaseData.documentType = 'BILL';
                purchaseData.isBill = true;
            }

            // Sequential billNumber for BILL and FA types
            if ((purchaseData.documentType === 'BILL' || purchaseData.documentType === 'FA') && !purchaseData.billNumber) {
                const last = await Purchase.findOne({ companyId: purchaseData.companyId, isBill: true }).sort({ createdAt: -1 });
                let nextNum = 1;
                if (last && last.billNumber) {
                    const parts = last.billNumber.split('-');
                    const lastNum = parseInt(parts[parts.length - 1]);
                    if (!isNaN(lastNum)) nextNum = lastNum + 1;
                }
                purchaseData.billNumber = `${nextNum}`;
            }

            // Sequential orderNumber for PO type
            if (purchaseData.documentType === 'PO' && !purchaseData.orderNumber) {
                const last = await Purchase.findOne({ companyId: purchaseData.companyId, documentType: 'PO' }).sort({ createdAt: -1 });
                let nextNum = 1;
                if (last && last.orderNumber) {
                    const parts = last.orderNumber.split('-');
                    const lastNum = parseInt(parts[parts.length - 1]);
                    if (!isNaN(lastNum)) nextNum = lastNum + 1;
                }
                purchaseData.orderNumber = `${nextNum}`;
            }

            const purchase = new Purchase(purchaseData);
            await purchase.save({ session });

            // --- EFFECT LOGIC ---
            // Only affect Inventory and Accounts if it is a BILL (or RETURN)
            if (purchase.isBill) {

                // 1. Update Stock (Skip for FA and EXPENSE)
                if (purchase.items && purchase.items.length > 0 && purchase.documentType !== 'FA' && purchase.documentType !== 'EXPENSE') {
                    for (const lineItem of purchase.items) {
                        if (lineItem.itemId) {
                            const itemDoc = await Item.findById(lineItem.itemId).session(session);
                            if (itemDoc && itemDoc.type === 'product' && itemDoc.product) {

                                const qty = Number(lineItem.quantity);
                                // If Purchase Bill: Increase Stock
                                // If Purchase Return: Decrease Stock
                                const change = purchase.isReturn ? -qty : qty;

                                await Product.findByIdAndUpdate(
                                    itemDoc.product,
                                    { $inc: { 'currentQuantity': change } },
                                    { session }
                                );
                            }
                        }
                    }
                }

                // 2. Update Party Balance
                if (purchase.partyId) {
                    const payable = purchase.balanceDue;
                    if (payable !== 0) {
                        // If Purchase Bill: Increase Payable
                        // If Purchase Return: Decrease Payable
                        const balanceChange = purchase.isReturn ? -payable : payable;

                        await Party.findByIdAndUpdate(
                            purchase.partyId,
                            { $inc: { currentBalance: balanceChange } },
                            { session }
                        );
                    }
                }
            }

            // 3. Auto-generate PaymentOut for initial paid amount
            if (purchase.isBill && purchase.paidAmount > 0 && !purchase.isReturn && purchase.partyId) {
                const defaultReceipt = `PAYOUT-${Date.now().toString().slice(-6)}`;
                const paymentOut = new PaymentOut({
                    companyId: purchase.companyId,
                    partyId: purchase.partyId,
                    receiptNo: defaultReceipt,
                    date: purchase.billDate || Date.now(),
                    amount: purchase.paidAmount,
                    paymentMode: purchase.paymentType || 'Cash',
                    description: 'Auto-generated initial payment',
                    linkedPurchases: [{
                        purchaseId: purchase._id,
                        amountSettled: purchase.paidAmount
                    }]
                });
                await paymentOut.save({ session });
            }

            await session.commitTransaction();
            session.endSession();

            res.status(201).json(purchase);
        }
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.error("Purchase Create Error:", error);
        res.status(400).json({ error: error.message });
    }
};

exports.getPurchases = async (req, res) => {
    try {
        const { companyId, partyId, startDate, endDate, type, page, limit, sortBy, sortOrder } = req.query;
        const filter = {};

        if (companyId) filter.companyId = companyId;
        if (partyId) filter.partyId = partyId;
        if (req.query.godown) filter.godown = req.query.godown;

        // Sorting Logic
        let sortObj = { createdAt: -1 };
        if (sortBy) {
            sortObj = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };
        }

        // Reusable function to handle pagination
        const applyPaginationAndRespond = async (Model, filterToUse) => {
            let query = Model.find(filterToUse).sort(sortObj).populate('partyId', 'name phone gstin');

            if (page && limit) {
                const pageNum = parseInt(page);
                const limitNum = parseInt(limit);
                const skip = (pageNum - 1) * limitNum;

                query = query.skip(skip).limit(limitNum);
                const data = await query.exec();
                const total = await Model.countDocuments(filterToUse);

                return res.json({
                    data,
                    pagination: {
                        total,
                        page: pageNum,
                        limit: limitNum,
                        totalPages: Math.ceil(total / limitNum)
                    }
                });
            } else {
                const data = await query.exec();
                return res.json(data);
            }
        };

        if (type === 'DEBIT_NOTE') {
            // Query DebitNote
            if (startDate && endDate) {
                filter.debitNoteDate = { $gte: new Date(startDate), $lte: new Date(endDate) };
            }
            return await applyPaginationAndRespond(DebitNote, filter);
        }

        if (type) filter.documentType = type; // Filter by PO or BILL
        if (req.query.isReturn !== undefined) filter.isReturn = req.query.isReturn === 'true';

        // Handle date filtering broadly (checking both fields just in case)
        if (startDate && endDate) {
            filter.$or = [
                { billDate: { $gte: new Date(startDate), $lte: new Date(endDate) } },
                { orderDate: { $gte: new Date(startDate), $lte: new Date(endDate) } }
            ];
        }

        await applyPaginationAndRespond(Purchase, filter);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getPurchaseById = async (req, res) => {
    try {
        const purchase = await Purchase.findById(req.params.id)
            .populate('partyId')
            .populate('items.itemId', 'name type');
        if (!purchase) return res.status(404).json({ message: 'Purchase not found' });
        res.json(purchase);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updatePurchase = async (req, res) => {
    // Note: This does NOT yet handle reverting/re-applying stock logic for edits.
    // That requires diffing the items or full reversal.
    try {
        const updateData = req.body;

        // --- HANDLE FILE UPLOADS ---
        const newImages = req.files && req.files.images ? req.files.images.map(f => `/uploads/${f.filename}`) : [];
        const newDocs = req.files && req.files.documents ? req.files.documents.map(f => `/uploads/${f.filename}`) : [];

        // Parse JSON fields
        ['items', 'discount', 'tax', 'priceUnit'].forEach(field => {
            if (typeof updateData[field] === 'string') {
                try {
                    updateData[field] = JSON.parse(updateData[field]);
                } catch (e) { }
            }
        });

        // Handle Images merging
        if (newImages.length > 0 || updateData.images) {
            let existingImages = [];
            if (updateData.images) {
                if (Array.isArray(updateData.images)) existingImages = updateData.images;
                else if (typeof updateData.images === 'string') {
                    try { existingImages = JSON.parse(updateData.images); }
                    catch { existingImages = [updateData.images]; }
                }
            }
            updateData.images = [...existingImages, ...newImages];
        }

        // Handle Documents merging
        if (newDocs.length > 0 || updateData.documents) {
            let existingDocs = [];
            if (updateData.documents) {
                if (Array.isArray(updateData.documents)) existingDocs = updateData.documents;
                else if (typeof updateData.documents === 'string') {
                    try { existingDocs = JSON.parse(updateData.documents); }
                    catch { existingDocs = [updateData.documents]; }
                }
            }
            updateData.documents = [...existingDocs, ...newDocs];
        }

        const docToDelete = await Purchase.findById(req.params.id);
        if (docToDelete && docToDelete.isBill) {
            // Revert Stock (Decrease since it was a purchase)
            if (docToDelete.items && docToDelete.items.length > 0 && docToDelete.documentType !== 'FA' && docToDelete.documentType !== 'EXPENSE') {
                for (const lineItem of docToDelete.items) {
                    if (lineItem.itemId) {
                        const itemDoc = await Item.findById(lineItem.itemId);
                        if (itemDoc && itemDoc.type === 'product' && itemDoc.product) {
                            const change = docToDelete.isReturn ? Number(lineItem.quantity) : -Number(lineItem.quantity);
                            await Product.findByIdAndUpdate(itemDoc.product, { $inc: { 'currentQuantity': change } });
                        }
                    }
                }
            }
        }

        const purchase = await Purchase.findByIdAndUpdate(req.params.id, updateData, { new: true });

        if (purchase && purchase.isBill) {
            // Apply New Stock (Increase)
            if (purchase.items && purchase.items.length > 0 && purchase.documentType !== 'FA' && purchase.documentType !== 'EXPENSE') {
                for (const lineItem of purchase.items) {
                    if (lineItem.itemId) {
                        const itemDoc = await Item.findById(lineItem.itemId);
                        if (itemDoc && itemDoc.type === 'product' && itemDoc.product) {
                            const change = purchase.isReturn ? -Number(lineItem.quantity) : Number(lineItem.quantity);
                            await Product.findByIdAndUpdate(itemDoc.product, { $inc: { 'currentQuantity': change } });
                        }
                    }
                }
            }
        }

        res.json(purchase);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.deletePurchase = async (req, res) => {
    const session = await Purchase.startSession();
    session.startTransaction();
    try {
        let purchase = await Purchase.findById(req.params.id).session(session);
        let isDebitNote = false;

        if (!purchase) {
            purchase = await DebitNote.findById(req.params.id).session(session);
            if (purchase) isDebitNote = true;
        }

        if (!purchase) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({ message: 'Purchase not found' });
        }

        // --- REVERT EFFECTS (If it was a BILL, RETURN, or DEBIT NOTE) ---
        if (isDebitNote) {
            // Debit Notes originally decreased stock. Revert by increasing stock.
            if (purchase.items && purchase.items.length > 0) {
                for (const lineItem of purchase.items) {
                    if (lineItem.itemId) {
                        const itemDoc = await Item.findById(lineItem.itemId).session(session);
                        if (itemDoc && itemDoc.type === 'product' && itemDoc.product) {
                            await Product.findByIdAndUpdate(
                                itemDoc.product,
                                { $inc: { 'currentQuantity': Number(lineItem.quantity) } },
                                { session }
                            );
                        }
                    }
                }
            }

            if (purchase.partyId) {
                // Debit Notes originally decreased currentBalance (Payable). Revert by increasing.
                await Party.findByIdAndUpdate(
                    purchase.partyId,
                    { $inc: { currentBalance: Number(purchase.grandTotal) || 0 } },
                    { session }
                );
            }
        } else if (purchase.isBill) {
            // 1. Revert Stock
            if (purchase.items && purchase.items.length > 0) {
                for (const lineItem of purchase.items) {
                    if (lineItem.itemId) {
                        const itemDoc = await Item.findById(lineItem.itemId).session(session);
                        if (itemDoc && itemDoc.type === 'product' && itemDoc.product) {
                            const qty = Number(lineItem.quantity);
                            // Original Action: Bill -> Inc Stock, Return -> Dec Stock
                            // Revert Action: Bill -> Dec Stock, Return -> Inc Stock
                            const change = purchase.isReturn ? qty : -qty;

                            await Product.findByIdAndUpdate(
                                itemDoc.product,
                                { $inc: { 'currentQuantity': change } },
                                { session }
                            );
                        }
                    }
                }
            }

            // 2. Revert Party Balance
            if (purchase.partyId) {
                const payable = purchase.balanceDue;
                if (payable !== 0) {
                    // Original Action: Bill -> Inc Payable, Return -> Dec Payable (via negative)
                    // Revert Action: Bill -> Dec Payable, Return -> Inc Payable
                    // Note: stored balanceDue is positive for payable.
                    // In create: if isReturn? -payable : payable.
                    // So revert is: if isReturn? payable : -payable.
                    const balanceChange = purchase.isReturn ? payable : -payable;

                    await Party.findByIdAndUpdate(
                        purchase.partyId,
                        { $inc: { currentBalance: balanceChange } },
                        { session }
                    );
                }
            }
        }

        if (isDebitNote) {
            await DebitNote.findByIdAndDelete(req.params.id).session(session);
        } else {
            await Purchase.findByIdAndDelete(req.params.id).session(session);
        }

        await session.commitTransaction();
        session.endSession();
        res.json({ message: 'Purchase deleted' });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        res.status(500).json({ error: error.message });
    }
};

// New Endpoint: Convert PO to Bill
exports.convertToBill = async (req, res) => {
    const session = await Purchase.startSession();
    session.startTransaction();
    try {
        const poId = req.params.id;
        const po = await Purchase.findById(poId).session(session);
        if (!po || po.documentType !== 'PO') {
            throw new Error("Invalid Purchase Order");
        }

        // Create new Bill based on PO
        const billData = po.toObject();
        delete billData._id;
        delete billData.createdAt;
        delete billData.updatedAt;

        billData.documentType = 'BILL';
        billData.isBill = true;
        if (req.body.billNumber) {
            billData.billNumber = req.body.billNumber;
        } else {
            const lastBill = await Purchase.findOne({ companyId: po.companyId, isBill: true }).sort({ createdAt: -1 }).session(session);
            let nextNum = 1;
            if (lastBill && lastBill.billNumber) {
                const parts = lastBill.billNumber.split('-');
                const lastNum = parseInt(parts[parts.length - 1]);
                if (!isNaN(lastNum)) nextNum = lastNum + 1;
            }
            billData.billNumber = `${nextNum}`;
        }
        billData.billDate = new Date();
        billData.orderNumber = po.orderNumber; // Keep reference

        const bill = new Purchase(billData);
        await bill.save({ session });

        // Mark PO as converted
        po.convertedToBillId = bill._id;
        await po.save({ session });

        // Apply Stock/Accounting effects for the new Bill
        // (Reusing logic logic or calling internal helper)
        if (bill.items && bill.items.length > 0) {
            for (const lineItem of bill.items) {
                if (lineItem.itemId) {
                    const itemDoc = await Item.findById(lineItem.itemId).session(session);
                    if (itemDoc && itemDoc.type === 'product' && itemDoc.product) {
                        await Product.findByIdAndUpdate(
                            itemDoc.product,
                            { $inc: { 'currentQuantity': Number(lineItem.quantity) } },
                            { session }
                        );
                    }
                }
            }
        }

        if (bill.partyId) {
            const payable = bill.balanceDue;
            if (payable !== 0) {
                await Party.findByIdAndUpdate(
                    bill.partyId,
                    { $inc: { currentBalance: -payable } },
                    { session }
                );
            }
        }

        await session.commitTransaction();
        session.endSession();
        res.status(201).json(bill);

    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        res.status(400).json({ error: error.message });
    }
}
exports.processReturn = async (req, res) => {
    const session = await Purchase.startSession();
    session.startTransaction();
    try {
        const purchaseId = req.params.id;
        const { items: returnItems, ...otherDetails } = req.body;

        const originalPurchase = await Purchase.findById(purchaseId).session(session);
        if (!originalPurchase) {
            throw new Error("Original Purchase not found");
        }

        const returnData = {
            ...originalPurchase.toObject(),
            ...otherDetails
        };

        delete returnData._id;
        delete returnData.createdAt;
        delete returnData.updatedAt;
        delete returnData.convertedToBillId;

        // Force Return Flags
        returnData.isReturn = true;
        returnData.isBill = true; // Returns are accounting documents
        returnData.documentType = 'BILL';
        returnData.originalPurchaseId = originalPurchase._id;

        // Generate Return Number
        if (returnData.billNumber && !returnData.billNumber.startsWith('RET-')) {
            returnData.billNumber = `RET-${originalPurchase.billNumber}`;
        }

        if (returnItems && returnItems.length > 0) {
            returnData.items = returnItems;
        }

        const returnPurchase = new Purchase(returnData);
        await returnPurchase.save({ session });

        // --- EFFECT LOGIC For Return ---
        // 1. Stock: Decrease (Sending items back)
        if (returnPurchase.items && returnPurchase.items.length > 0) {
            for (const lineItem of returnPurchase.items) {
                if (lineItem.itemId) {
                    const itemDoc = await Item.findById(lineItem.itemId).session(session);
                    if (itemDoc && itemDoc.type === 'product' && itemDoc.product) {
                        const qty = Number(lineItem.quantity);
                        // Return -> Decrease Stock
                        await Product.findByIdAndUpdate(
                            itemDoc.product,
                            { $inc: { 'currentQuantity': -qty } },
                            { session }
                        );
                    }
                }
            }
        }

        // 2. Party Balance: Increase Balance (Less negative = We owe less)
        if (returnPurchase.partyId) {
            const amount = returnPurchase.balanceDue;
            if (amount !== 0) {
                await Party.findByIdAndUpdate(
                    returnPurchase.partyId,
                    { $inc: { currentBalance: amount } }, // Add positive amount to reduce debt
                    { session }
                );
            }
        }

        await session.commitTransaction();
        session.endSession();
        res.status(201).json(returnPurchase);

    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        res.status(400).json({ error: error.message });
    }
}

exports.cancelPurchase = async (req, res) => {
    const session = await Purchase.startSession();
    session.startTransaction();
    try {
        let purchase = await Purchase.findById(req.params.id).session(session);
        let isDebitNote = false;

        if (!purchase) {
            purchase = await DebitNote.findById(req.params.id).session(session);
            isDebitNote = true;
        }

        if (!purchase) {
            throw new Error('Purchase/Debit Note not found');
        }

        if (purchase.status === 'Cancelled') {
            throw new Error('Document is already cancelled');
        }

        // --- REVERT EFFECTS (If it was a BILL, RETURN, or DEBIT NOTE) ---
        if (isDebitNote) {
            if (purchase.items && purchase.items.length > 0) {
                for (const lineItem of purchase.items) {
                    if (lineItem.itemId) {
                        const itemDoc = await Item.findById(lineItem.itemId).session(session);
                        if (itemDoc && itemDoc.type === 'product' && itemDoc.product) {
                            await Product.findByIdAndUpdate(
                                itemDoc.product,
                                { $inc: { 'currentQuantity': Number(lineItem.quantity) } },
                                { session }
                            );
                        }
                    }
                }
            }

            if (purchase.partyId) {
                await Party.findByIdAndUpdate(
                    purchase.partyId,
                    { $inc: { currentBalance: Number(purchase.grandTotal) || 0 } },
                    { session }
                );
            }
        } else if (purchase.isBill || purchase.documentType === 'BILL') {
            // 1. Revert Stock — FA and EXPENSE never affected stock on create, so skip them
            const affectsStock = purchase.documentType !== 'FA' && purchase.documentType !== 'EXPENSE';
            if (affectsStock && purchase.items && purchase.items.length > 0) {
                for (const lineItem of purchase.items) {
                    if (lineItem.itemId) {
                        const itemDoc = await Item.findById(lineItem.itemId).session(session);
                        if (itemDoc && itemDoc.type === 'product' && itemDoc.product) {
                            const qty = Number(lineItem.quantity);
                            const change = purchase.isReturn ? qty : -qty;

                            await Product.findByIdAndUpdate(
                                itemDoc.product,
                                { $inc: { 'currentQuantity': change } },
                                { session }
                            );
                        }
                    }
                }
            }

            // 2. Revert Party Balance
            if (purchase.partyId) {
                const payable = purchase.balanceDue;
                if (payable !== 0) {
                    const balanceChange = purchase.isReturn ? payable : -payable;
                    await Party.findByIdAndUpdate(
                        purchase.partyId,
                        { $inc: { currentBalance: balanceChange } },
                        { session }
                    );
                }
            }
        }

        purchase.status = 'Cancelled';
        await purchase.save({ session });

        await session.commitTransaction();
        session.endSession();
        res.json({ message: 'Purchase cancelled', doc: purchase });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        res.status(500).json({ error: error.message });
    }
};


