const SaleOrder = require('../models/SaleOrder');
const SaleInvoice = require('../models/SaleInvoice');
const ProformaInvoice = require('../models/ProformaInvoice');
const Estimate = require('../models/Estimate');
const PaymentIn = require('../models/PaymentIn');
const Item = require('../models/Item');
const Product = require('../models/Product');
const Party = require('../models/Party');
const DeliveryChallan = require('../models/DeliveryChallan');
const CreditNote = require('../models/CreditNote');
const JobWorkOut = require('../models/JobWorkOut');

// Returns the next sequential number for a document type, always higher than the current max
const getNextNumber = async (Model, companyId, field, extraFilter = {}) => {
    const docs = await Model.find({ companyId, ...extraFilter }).select(field).lean();
    let max = 0;
    for (const d of docs) {
        const val = d[field];
        if (val) {
            const n = parseInt(String(val).split('-').pop(), 10);
            if (!isNaN(n) && n > max) max = n;
        }
    }
    return max + 1;
};

// Batch-fetch Items by IDs to avoid N+1 queries inside loops
const batchGetItems = async (itemIds, session) => {
    if (!itemIds || itemIds.length === 0) return new Map();
    const query = Item.find({ _id: { $in: itemIds } }).lean();
    if (session) query.session(session);
    const items = await query;
    return new Map(items.map(item => [item._id.toString(), item]));
};

const calculateInvoiceStatus = (sale) => {
    // 1. Paid Check
    // Strictly rely on balanceDue. isPaid should be a result, not a cause.
    if (sale.balanceDue !== undefined && sale.balanceDue <= 1) {
        return 'Paid';
    }

    // 2. Overdue Check
    const now = new Date();
    if (sale.dueDate && new Date(sale.dueDate) < now && sale.balanceDue > 1) {
        return 'Overdue';
    }

    // 3. Partial vs Unpaid
    const total = sale.grandTotal || 0;
    const balance = sale.balanceDue || 0;

    // If some amount is paid but not fully (balance < total)
    if (balance < total) {
        return 'Partial';
    }

    // 4. Default to Unpaid
    return 'Unpaid';
};

const createSale = async (req, res) => {
    const session = await SaleInvoice.startSession(); // Use any model for session
    session.startTransaction();
    try {
        const saleData = req.body;

        // --- HANDLE FILE UPLOADS ---
        if (req.files) {
            if (req.files.images) {
                saleData.images = req.files.images.map(f => `/uploads/${f.filename}`);
            }
            if (req.files.documents) {
                saleData.documents = req.files.documents.map(f => `/uploads/${f.filename}`);
            }
        }

        // Parse nested JSON fields (common with FormData)
        ['items', 'discount', 'tax', 'priceUnit'].forEach(field => {
            if (typeof saleData[field] === 'string') {
                try {
                    saleData[field] = JSON.parse(saleData[field]);
                } catch (e) {
                    // console.error(`Error parsing ${field}:`, e);
                }
            }
        });

        if (saleData.documentType === 'SO') {
            // --- CREATE SALE ORDER ---
            delete saleData.documentType; // Clean up

            // Auto-Generate Order Number
            if (!saleData.orderNumber) {
                saleData.orderNumber = `${await getNextNumber(SaleOrder, saleData.companyId, 'orderNumber')}`;
            }

            const saleOrder = new SaleOrder(saleData);
            await saleOrder.save({ session });

            // If converted from Proforma, update Proforma Status
            if (saleData.convertedFromProformaId) {
                const proforma = await ProformaInvoice.findById(saleData.convertedFromProformaId).session(session);
                if (proforma) {
                    proforma.status = 'CONVERTED';
                    proforma.convertedToOrderId = saleOrder._id;
                    await proforma.save({ session });
                }
            }

            await session.commitTransaction();
            session.endSession();
            return res.status(201).json(saleOrder);


        } else if (saleData.documentType === 'PROFORMA') {
            // --- CREATE PROFORMA INVOICE ---
            delete saleData.documentType;

            if (!saleData.refNo) {
                saleData.refNo = `${await getNextNumber(ProformaInvoice, saleData.companyId, 'refNo')}`;
            }

            const proforma = new ProformaInvoice(saleData);
            await proforma.save({ session });
            await session.commitTransaction();
            session.endSession();
            return res.status(201).json(proforma);

        } else if (saleData.documentType === 'ESTIMATE') {
            // --- CREATE ESTIMATE ---
            delete saleData.documentType;

            if (!saleData.refNo) {
                saleData.refNo = `${await getNextNumber(Estimate, saleData.companyId, 'refNo')}`;
            }

            const estimate = new Estimate(saleData);
            await estimate.save({ session });
            await session.commitTransaction();
            session.endSession();
            return res.status(201).json(estimate);

        } else if (saleData.documentType === 'DELIVERY_CHALLAN') {
            // --- CREATE DELIVERY CHALLAN ---
            delete saleData.documentType;

            if (!saleData.challanNumber) {
                saleData.challanNumber = `${await getNextNumber(DeliveryChallan, saleData.companyId, 'challanNumber')}`;
            }

            const challan = new DeliveryChallan(saleData);
            await challan.save({ session });

            // Effect: Decrease Stock (Goods have left)
            if (challan.items && challan.items.length > 0) {
                const challanItemIds = challan.items.filter(i => i.itemId).map(i => i.itemId);
                const challanItemsMap = await batchGetItems(challanItemIds, session);
                const challanProductUpdates = {};
                for (const lineItem of challan.items) {
                    if (lineItem.itemId) {
                        const itemDoc = challanItemsMap.get(lineItem.itemId.toString());
                        if (itemDoc && itemDoc.type === 'product' && itemDoc.product) {
                            const productId = itemDoc.product.toString();
                            challanProductUpdates[productId] = (challanProductUpdates[productId] || 0) - Number(lineItem.quantity);
                        }
                    }
                }
                for (const [productId, change] of Object.entries(challanProductUpdates)) {
                    await Product.findByIdAndUpdate(productId, { $inc: { 'currentQuantity': change } }, { session });
                }
            }

            await session.commitTransaction();
            session.endSession();
            return res.status(201).json(challan);

        } else if (saleData.documentType === 'CREDIT_NOTE') {
            // --- CREATE CREDIT NOTE ---
            delete saleData.documentType;

            if (!saleData.returnNo) {
                const last = await CreditNote.findOne({ companyId: saleData.companyId }).sort({ createdAt: -1 });
                let nextNum = 1;
                if (last && last.returnNo) {
                    const parts = last.returnNo.split('-');
                    const lastNum = parseInt(parts[parts.length - 1]);
                    if (!isNaN(lastNum)) nextNum = lastNum + 1;
                }
                saleData.returnNo = `${nextNum}`;
            }

            const creditNote = new CreditNote(saleData);
            await creditNote.save({ session });

            // Effect 1: Increase Stock (Goods returned)
            if (creditNote.items && creditNote.items.length > 0) {
                const cnItemIds = creditNote.items.filter(i => i.itemId).map(i => i.itemId);
                const cnItemsMap = await batchGetItems(cnItemIds, session);
                const cnProductUpdates = {};
                for (const lineItem of creditNote.items) {
                    if (lineItem.itemId) {
                        const itemDoc = cnItemsMap.get(lineItem.itemId.toString());
                        if (itemDoc && itemDoc.type === 'product' && itemDoc.product) {
                            const productId = itemDoc.product.toString();
                            cnProductUpdates[productId] = (cnProductUpdates[productId] || 0) + Number(lineItem.quantity);
                        }
                    }
                }
                for (const [productId, change] of Object.entries(cnProductUpdates)) {
                    await Product.findByIdAndUpdate(productId, { $inc: { 'currentQuantity': change } }, { session });
                }
            }

            // Effect 2: Update Party Balance (Decrease Receivables)
            if (creditNote.partyId) {
                const amount = Number(creditNote.grandTotal) || 0;
                await Party.findByIdAndUpdate(creditNote.partyId, { $inc: { currentBalance: -amount } }, { session });
            }

            // Effect 3: Mark linked Sale Invoice as Paid (balance = 0)
            if (creditNote.linkedInvoiceId) {
                await SaleInvoice.findByIdAndUpdate(
                    creditNote.linkedInvoiceId,
                    { balanceDue: 0, status: 'Paid', isPaid: true },
                    { session }
                );
            }

            await session.commitTransaction();
            session.endSession();
            return res.status(201).json(creditNote);

        } else if (saleData.documentType === 'JOB_WORK_OUT') {
            // --- CREATE JOB WORK OUT CHALLAN ---
            delete saleData.documentType;

            if (!saleData.jobId) {
                const last = await JobWorkOut.findOne({ companyId: saleData.companyId }).sort({ createdAt: -1 });
                let nextNum = 1;
                if (last && last.jobId) {
                    const lastNum = parseInt(last.jobId);
                    if (!isNaN(lastNum)) nextNum = lastNum + 1;
                }
                saleData.jobId = `${nextNum}`;
            }

            const jwo = new JobWorkOut(saleData);
            await jwo.save({ session });
            await session.commitTransaction();
            session.endSession();
            return res.status(201).json(jwo);

        } else {
            // --- CREATE SALE INVOICE (Default) ---
            // saleData.documentType = 'INVOICE'; // Implicit

            // Auto-Generate Invoice Number
            if (!saleData.invoiceNumber) {
                saleData.invoiceNumber = `${await getNextNumber(SaleInvoice, saleData.companyId, 'invoiceNumber')}`;
            }

            const saleInvoice = new SaleInvoice({
                ...saleData,
                createdBy: req.user ? req.user.id : undefined
            });

            // Calculate Status & Sync isPaid
            saleInvoice.status = calculateInvoiceStatus(saleInvoice);
            saleInvoice.isPaid = saleInvoice.status === 'Paid';

            // Track initial payment in history only (PaymentIn is created separately via Receive Payment action)
            if (saleInvoice.receivedAmount > 0) {
                saleInvoice.paymentHistory.push({
                    date: saleInvoice.invoiceDate || Date.now(),
                    amount: saleInvoice.receivedAmount,
                    paymentMode: saleInvoice.paymentMode || saleInvoice.paymentType || 'Cash',
                    notes: 'Initial Payment'
                });
            }

            await saleInvoice.save({ session });

            // If created from Order, update Order Status
            if (saleData.orderId) {
                const order = await SaleOrder.findById(saleData.orderId).session(session);
                if (order) {
                    order.status = 'CONVERTED';
                    order.convertedToInvoiceId = saleInvoice._id;
                    await order.save({ session });
                }
            }
            // If created from Proforma
            if (saleData.convertedFromProformaId) {
                const proforma = await ProformaInvoice.findById(saleData.convertedFromProformaId).session(session);
                if (proforma) {
                    proforma.status = 'CONVERTED';
                    proforma.convertedToInvoiceId = saleInvoice._id;
                    await proforma.save({ session });
                }
            }
            // If created from Estimate
            if (saleData.convertedFromEstimateId) {
                const estimate = await Estimate.findById(saleData.convertedFromEstimateId).session(session);
                if (estimate) {
                    estimate.status = 'CONVERTED';
                    estimate.convertedToInvoiceId = saleInvoice._id;
                    await estimate.save({ session });
                }
            }

            // --- EFFECT LOGIC (Stock & Party) ---
            // 1. Update Stock
            // 1. Update Stock (Aggregated to prevent WriteConflict)
            const productUpdates = {}; // { productId: quantityChange }

            if (saleInvoice.items && saleInvoice.items.length > 0) {
                // Batch fetch all item docs to avoid N+1 queries
                const invoiceItemIds = saleInvoice.items.filter(i => i.itemId).map(i => i.itemId);
                const invoiceItemsMap = await batchGetItems(invoiceItemIds, session);

                // First pass: Calculate total changes per product
                for (const lineItem of saleInvoice.items) {
                    if (lineItem.itemId) {
                        const itemDoc = invoiceItemsMap.get(lineItem.itemId.toString());
                        if (itemDoc && itemDoc.type === 'product' && itemDoc.product) {
                            const qty = Number(lineItem.quantity);
                            const productId = itemDoc.product.toString();
                            // Sale: Decrease Stock
                            productUpdates[productId] = (productUpdates[productId] || 0) - qty;
                        }
                    }
                }

                // Second pass: Perform updates (one per product)
                for (const [productId, change] of Object.entries(productUpdates)) {
                    await Product.findByIdAndUpdate(productId, { $inc: { 'currentQuantity': change } }, { session });
                }
            }

            // 2. Update Party Balance
            if (saleInvoice.partyId) {
                // If Sale (Credit/Cash check? Usually all invoices affect balance logic if strictly accounting, but simplified here:
                // Assuming "Paid" invoices might not affect balance if receivedAmount == grandTotal?
                // For now, let's stick to standard: Invoice increases Receivable. Payment reduces it.
                // If receivedAmount is present, we handle the net effect.

                const amount = saleInvoice.grandTotal; // Total amount to be received
                const received = saleInvoice.receivedAmount || 0;
                const netBalanceChange = amount - received; // Amount still due

                if (netBalanceChange !== 0 && saleInvoice.paymentType === 'Credit') {
                    await Party.findByIdAndUpdate(saleInvoice.partyId, { $inc: { currentBalance: netBalanceChange } }, { session });
                }
            }

            await session.commitTransaction();
            session.endSession();
            return res.status(201).json(saleInvoice);
        }

    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.error("Sale Create Error:", error);
        res.status(400).json({ error: error.message });
    }
}

const getSales = async (req, res) => {
    try {
        const { companyId, partyId, startDate, endDate, type, isReturn, page, limit, sortBy, sortOrder } = req.query;
        const filter = {};
        if (companyId) filter.companyId = companyId;
        if (partyId) filter.partyId = partyId;
        if (req.query.godown) filter.godown = req.query.godown;
        if (req.query.userId) {
            if (req.query.userId === 'admin') {
                filter.$or = [{ createdBy: { $exists: false } }, { createdBy: null }];
            } else {
                filter.createdBy = req.query.userId;
            }
        }
        if (req.query.status && req.query.status !== 'All Status') filter.status = req.query.status;
        if (req.query.saleMode) filter.saleMode = req.query.saleMode;

        // Helper to add date filter if exists
        const addDateFilter = (field) => {
            if (startDate && endDate) {
                filter[field] = { $gte: new Date(startDate), $lte: new Date(endDate) };
            }
        };

        // Sorting Logic
        let sortObj = { createdAt: -1 };
        if (sortBy) {
            sortObj = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };
        }

        const applyPaginationAndRespond = async (Model, filterToUse, populateFields = []) => {
            let query = Model.find(filterToUse).sort(sortObj).lean();

            populateFields.forEach(p => {
                if (typeof p === 'string') query = query.populate(p, 'name phone');
                else query = query.populate(p.path, p.select);
            });

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

        if (type === 'SO') {
            addDateFilter('orderDate');
            // Fetch orders with populated fields
            const soQuery = SaleOrder.find(filter)
                .populate('partyId', 'name phone')
                .populate('convertedToInvoiceId', 'invoiceNumber')
                .sort({ createdAt: -1 });
            const orders = await soQuery.exec();

            // Auto-repair: for CONVERTED orders missing convertedToInvoiceId, look up via reverse orderId
            const orphaned = orders.filter(o => o.status === 'CONVERTED' && !o.convertedToInvoiceId);
            if (orphaned.length > 0) {
                const linkedInvoices = await SaleInvoice.find({
                    orderId: { $in: orphaned.map(o => o._id) }
                }).select('invoiceNumber orderId').lean();
                const invMap = new Map(linkedInvoices.map(i => [i.orderId?.toString(), i]));
                for (const order of orphaned) {
                    const inv = invMap.get(order._id.toString());
                    if (inv) {
                        // Found the linked invoice — repair the reference
                        order.convertedToInvoiceId = inv;
                        SaleOrder.findByIdAndUpdate(order._id, { convertedToInvoiceId: inv._id }).exec().catch(() => {});
                    } else {
                        // No linked invoice found (was never set or invoice was deleted) — reset to OPEN so user can re-convert
                        order.status = 'OPEN';
                        order.convertedToInvoiceId = null;
                        SaleOrder.findByIdAndUpdate(order._id, { status: 'OPEN', convertedToInvoiceId: null }).exec().catch(() => {});
                    }
                }
            }

            return res.json(orders);

        } else if (type === 'PROFORMA') {
            addDateFilter('invoiceDate');
            return await applyPaginationAndRespond(ProformaInvoice, filter, [
                { path: 'partyId', select: 'name phone' },
                { path: 'convertedToInvoiceId', select: 'invoiceNumber' },
                { path: 'convertedToOrderId', select: 'orderNumber' },
            ]);

        } else if (type === 'ESTIMATE') {
            addDateFilter('invoiceDate');
            return await applyPaginationAndRespond(Estimate, filter, [
                { path: 'partyId', select: 'name phone' },
                { path: 'convertedToInvoiceId', select: 'invoiceNumber' },
                { path: 'convertedToOrderId', select: 'orderNumber' },
            ]);

        } else if (type === 'DELIVERY_CHALLAN') {
            addDateFilter('challanDate');
            return await applyPaginationAndRespond(DeliveryChallan, filter, ['partyId']);

        } else if (type === 'CREDIT_NOTE') {
            addDateFilter('creditNoteDate');
            return await applyPaginationAndRespond(CreditNote, filter, ['partyId']);

        } else if (type === 'JOB_WORK_OUT') {
            addDateFilter('invoiceDate');
            return await applyPaginationAndRespond(JobWorkOut, filter, ['partyId']);

        } else {
            // --- SALE INVOICE (Default) ---
            addDateFilter('invoiceDate');
            if (isReturn !== undefined) filter.isReturn = isReturn === 'true';

            return await applyPaginationAndRespond(SaleInvoice, filter, [
                { path: 'partyId', select: 'name phone gstin' },
                { path: 'createdBy', select: 'name' }
            ]);
        }

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getSaleById = async (req, res) => {
    try {
        // Try Invoice first, then Order (Or passing type would be better, but ID collision unlikely if OID)
        let doc = await SaleInvoice.findById(req.params.id).populate('partyId');
        if (!doc) {
            doc = await SaleOrder.findById(req.params.id).populate('partyId');
        }
        if (!doc) {
            doc = await ProformaInvoice.findById(req.params.id).populate('partyId');
        }
        if (!doc) {
            doc = await Estimate.findById(req.params.id).populate('partyId');
        }
        if (!doc) {
            doc = await DeliveryChallan.findById(req.params.id).populate('partyId');
        }
        if (!doc) {
            doc = await CreditNote.findById(req.params.id).populate('partyId');
        }

        if (!doc) return res.status(404).json({ message: 'Sale Document not found' });
        res.json(doc);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Convert Sale Order to Invoice
const convertToInvoice = async (req, res) => {
    const session = await SaleInvoice.startSession();
    session.startTransaction();
    try {
        const id = req.params.id;
        let doc = await SaleOrder.findById(id).session(session);
        let type = 'SO';

        if (!doc) {
            doc = await ProformaInvoice.findById(id).session(session);
            type = 'PROFORMA';
        }

        if (!doc) {
            doc = await Estimate.findById(id).session(session);
            type = 'ESTIMATE';
        }
        if (!doc) {
            doc = await DeliveryChallan.findById(id).session(session);
            type = 'DELIVERY_CHALLAN';
        }
        if (!doc) {
            doc = await JobWorkOut.findById(id).session(session);
            type = 'JOB_WORK_OUT';
        }

        if (!doc) throw new Error("Sale Document not found");

        // Prepare Invoice Data
        const invoiceData = doc.toObject();
        delete invoiceData._id;
        delete invoiceData.status;

        if (type === 'SO') {
            delete invoiceData.isOrder;
            delete invoiceData.orderNumber;
            invoiceData.orderId = doc._id;
        } else if (type === 'PROFORMA') {
            delete invoiceData.isProforma;
            delete invoiceData.refNo;
            invoiceData.proformaId = doc._id;
        } else if (type === 'ESTIMATE') {
            delete invoiceData.isEstimate;
            delete invoiceData.refNo;
            invoiceData.estimateId = doc._id; // Needs to be added to SaleInvoice schema if strict, or just omit
        } else if (type === 'DELIVERY_CHALLAN') {
            delete invoiceData.isChallan;
            delete invoiceData.challanNumber;
            invoiceData.challanId = doc._id;
        } else if (type === 'JOB_WORK_OUT') {
            delete invoiceData.jobId;
            delete invoiceData.finishedGood;
            delete invoiceData.additionalCharges;
            delete invoiceData.jobWorkCharges;
            delete invoiceData.taxRate;
            delete invoiceData.deliveryDate;
            delete invoiceData.paymentTerms;
            invoiceData.jobWorkOutId = doc._id;
        }

        if (!invoiceData.invoiceNumber) {
            invoiceData.invoiceNumber = `${await getNextNumber(SaleInvoice, invoiceData.companyId, 'invoiceNumber')}`;
        }
        invoiceData.invoiceDate = new Date();

        const newInvoice = new SaleInvoice(invoiceData);
        // Calculate status on conversion too
        newInvoice.status = calculateInvoiceStatus(newInvoice);
        newInvoice.isPaid = newInvoice.status === 'Paid';

        await newInvoice.save({ session });

        // Update Status
        doc.status = 'CONVERTED';
        doc.convertedToInvoiceId = newInvoice._id;
        if (type === 'JOB_WORK_OUT') doc.convertedAt = new Date();
        await doc.save({ session });

        // Update Stock & Party (Copy Logic from createSale or refactor)
        // If from Delivery Challan, Stock was already reduced. Do NOT reduce again.
        if (type !== 'DELIVERY_CHALLAN' && newInvoice.items && newInvoice.items.length > 0) {
            const convertItemIds = newInvoice.items.filter(i => i.itemId).map(i => i.itemId);
            const convertItemsMap = await batchGetItems(convertItemIds, session);
            const convertProductUpdates = {};
            for (const lineItem of newInvoice.items) {
                if (lineItem.itemId) {
                    const itemDoc = convertItemsMap.get(lineItem.itemId.toString());
                    if (itemDoc && itemDoc.type === 'product' && itemDoc.product) {
                        const productId = itemDoc.product.toString();
                        convertProductUpdates[productId] = (convertProductUpdates[productId] || 0) - Number(lineItem.quantity);
                    }
                }
            }
            for (const [productId, change] of Object.entries(convertProductUpdates)) {
                await Product.findByIdAndUpdate(productId, { $inc: { 'currentQuantity': change } }, { session });
            }
        }
        // Simplified Party update
        if (newInvoice.partyId) {
            const amount = newInvoice.balanceDue; // Logic: Assuming balance carries over
            if (amount > 0) {
                await Party.findByIdAndUpdate(newInvoice.partyId, { $inc: { currentBalance: amount } }, { session });
            }
        }

        await session.commitTransaction();
        session.endSession();
        res.status(200).json(newInvoice);

    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        res.status(400).json({ error: error.message });
    }
};

const updateSale = async (req, res) => {
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
            // If updateData.images was NOT sent, we risk overwriting with just newImages if we set it.
            // However, assuming Frontend sends 'images' if it wants to update the list.
            if (updateData.images || newImages.length > 0) {
                updateData.images = [...existingImages, ...newImages];
            }
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
            if (updateData.documents || newDocs.length > 0) {
                updateData.documents = [...existingDocs, ...newDocs];
            }
        }

        // Simplify: try update Invoice, if null try Order
        // Try SaleInvoice first as it's the priority for status updates
        let doc = await SaleInvoice.findById(req.params.id);
        let stockChangeDir = 0;
        let isInvoice = false;
        if (doc) { isInvoice = true; stockChangeDir = -1; }
        if (!doc) { doc = await DeliveryChallan.findById(req.params.id); if (doc) stockChangeDir = -1; }
        if (!doc) { doc = await CreditNote.findById(req.params.id); if (doc) stockChangeDir = 1; }

        if (doc) {
            // REVERT OLD STOCK
            if (doc.items && doc.items.length > 0) {
                const revertItemIds = doc.items.filter(i => i.itemId).map(i => i.itemId);
                const revertItemsMap = await batchGetItems(revertItemIds, null);
                const revertProductUpdates = {};
                for (const lineItem of doc.items) {
                    if (lineItem.itemId) {
                        const itemDoc = revertItemsMap.get(lineItem.itemId.toString());
                        if (itemDoc && itemDoc.type === 'product' && itemDoc.product) {
                            const productId = itemDoc.product.toString();
                            revertProductUpdates[productId] = (revertProductUpdates[productId] || 0) + (-(stockChangeDir) * Number(lineItem.quantity));
                        }
                    }
                }
                for (const [productId, change] of Object.entries(revertProductUpdates)) {
                    await Product.findByIdAndUpdate(productId, { $inc: { 'currentQuantity': change } });
                }
            }

            // REVERT OLD PARTY BALANCE
            if (isInvoice && doc.paymentType === 'Credit' && doc.partyId) {
                const oldNetDue = (doc.grandTotal || 0) - (doc.receivedAmount || 0);
                if (oldNetDue !== 0) {
                    await Party.findByIdAndUpdate(doc.partyId, { $inc: { currentBalance: -oldNetDue } });
                }
            }

            Object.assign(doc, updateData);
            if (isInvoice) {
                doc.status = calculateInvoiceStatus(doc);
                doc.isPaid = doc.status === 'Paid';
            }
            await doc.save();

            // APPLY NEW STOCK
            if (doc.items && doc.items.length > 0) {
                const applyItemIds = doc.items.filter(i => i.itemId).map(i => i.itemId);
                const applyItemsMap = await batchGetItems(applyItemIds, null);
                const applyProductUpdates = {};
                for (const lineItem of doc.items) {
                    if (lineItem.itemId) {
                        const itemDoc = applyItemsMap.get(lineItem.itemId.toString());
                        if (itemDoc && itemDoc.type === 'product' && itemDoc.product) {
                            const productId = itemDoc.product.toString();
                            applyProductUpdates[productId] = (applyProductUpdates[productId] || 0) + (stockChangeDir * Number(lineItem.quantity));
                        }
                    }
                }
                for (const [productId, change] of Object.entries(applyProductUpdates)) {
                    await Product.findByIdAndUpdate(productId, { $inc: { 'currentQuantity': change } });
                }
            }

            // APPLY NEW PARTY BALANCE
            if (isInvoice && doc.paymentType === 'Credit' && doc.partyId) {
                const newNetDue = (doc.grandTotal || 0) - (doc.receivedAmount || 0);
                if (newNetDue !== 0) {
                    await Party.findByIdAndUpdate(doc.partyId, { $inc: { currentBalance: newNetDue } });
                }
            }

            return res.json(doc);
        }

        let updated = await SaleOrder.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updated) {
            updated = await ProformaInvoice.findByIdAndUpdate(req.params.id, req.body, { new: true });
        }
        if (!updated) {
            updated = await Estimate.findByIdAndUpdate(req.params.id, req.body, { new: true });
        }
        res.json(updated);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const deleteSale = async (req, res) => {
    try {
        // Try deleting from Invoice first
        let docToDelete = await SaleInvoice.findById(req.params.id);
        let deleted = null;
        if (docToDelete) {
            // Revert Stock
            if (docToDelete.items && docToDelete.items.length > 0) {
                const delItemIds = docToDelete.items.filter(i => i.itemId).map(i => i.itemId);
                const delItemsMap = await batchGetItems(delItemIds, null);
                const delProductUpdates = {};
                for (const lineItem of docToDelete.items) {
                    if (lineItem.itemId) {
                        const itemDoc = delItemsMap.get(lineItem.itemId.toString());
                        if (itemDoc && itemDoc.type === 'product' && itemDoc.product) {
                            const productId = itemDoc.product.toString();
                            delProductUpdates[productId] = (delProductUpdates[productId] || 0) + Number(lineItem.quantity);
                        }
                    }
                }
                for (const [productId, change] of Object.entries(delProductUpdates)) {
                    await Product.findByIdAndUpdate(productId, { $inc: { 'currentQuantity': change } });
                }
            }

            // Revert Party Balance
            if (docToDelete.paymentType === 'Credit' && docToDelete.partyId) {
                const netDue = (docToDelete.grandTotal || 0) - (docToDelete.receivedAmount || 0);
                if (netDue !== 0) {
                    await Party.findByIdAndUpdate(docToDelete.partyId, { $inc: { currentBalance: -netDue } });
                }
            }

            deleted = await SaleInvoice.findByIdAndDelete(req.params.id);
        }

        if (!deleted) {
            // If not found, try Order
            deleted = await SaleOrder.findByIdAndDelete(req.params.id);
        }
        if (!deleted) {
            // If not found, try Proforma
            deleted = await ProformaInvoice.findByIdAndDelete(req.params.id);
        }
        if (!deleted) {
            // If not found, try Estimate
            deleted = await Estimate.findByIdAndDelete(req.params.id);
        }
        if (!deleted) {
            deleted = await DeliveryChallan.findByIdAndDelete(req.params.id);
        }
        if (!deleted) {
            deleted = await CreditNote.findByIdAndDelete(req.params.id);
        }

        if (!deleted) {
            return res.status(404).json({ message: 'Sale Document not found' });
        }
        res.json({ message: 'Deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const processReturn = async (req, res) => {
    // Return Logic updates for SaleInvoice
    // ... (Keep existing logic but point to SaleInvoice)
    res.status(501).json({ message: "Return logic refactor pending" });
};


const cancelSale = async (req, res) => {
    const session = await SaleInvoice.startSession();
    session.startTransaction();
    try {
        let docToCancel = await SaleInvoice.findById(req.params.id).session(session);
        let model = SaleInvoice;

        if (!docToCancel) { docToCancel = await SaleOrder.findById(req.params.id).session(session); model = SaleOrder; }
        if (!docToCancel) { docToCancel = await ProformaInvoice.findById(req.params.id).session(session); model = ProformaInvoice; }
        if (!docToCancel) { docToCancel = await Estimate.findById(req.params.id).session(session); model = Estimate; }
        if (!docToCancel) { docToCancel = await DeliveryChallan.findById(req.params.id).session(session); model = DeliveryChallan; }
        if (!docToCancel) { docToCancel = await CreditNote.findById(req.params.id).session(session); model = CreditNote; }

        if (!docToCancel) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({ message: 'Sale Document not found' });
        }

        if (docToCancel.status === 'Cancelled') {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({ message: 'Document is already cancelled' });
        }

        if (model === SaleInvoice) {
            // Invoice reduced stock on create — restore it
            if (docToCancel.items && docToCancel.items.length > 0) {
                const cancelInvItemIds = docToCancel.items.filter(i => i.itemId).map(i => i.itemId);
                const cancelInvItemsMap = await batchGetItems(cancelInvItemIds, session);
                const cancelInvProductUpdates = {};
                for (const lineItem of docToCancel.items) {
                    if (lineItem.itemId) {
                        const itemDoc = cancelInvItemsMap.get(lineItem.itemId.toString());
                        if (itemDoc && itemDoc.type === 'product' && itemDoc.product) {
                            const productId = itemDoc.product.toString();
                            cancelInvProductUpdates[productId] = (cancelInvProductUpdates[productId] || 0) + Number(lineItem.quantity);
                        }
                    }
                }
                for (const [productId, change] of Object.entries(cancelInvProductUpdates)) {
                    await Product.findByIdAndUpdate(productId, { $inc: { currentQuantity: change } }, { session });
                }
            }
            // Revert Party Balance (only credit invoices affect it)
            if (docToCancel.paymentType === 'Credit' && docToCancel.partyId) {
                const netDue = (docToCancel.grandTotal || 0) - (docToCancel.receivedAmount || 0);
                if (netDue !== 0) {
                    await Party.findByIdAndUpdate(docToCancel.partyId, { $inc: { currentBalance: -netDue } }, { session });
                }
            }
        } else if (model === DeliveryChallan) {
            // Challan reduced stock on create — restore it
            if (docToCancel.items && docToCancel.items.length > 0) {
                const cancelChallanItemIds = docToCancel.items.filter(i => i.itemId).map(i => i.itemId);
                const cancelChallanItemsMap = await batchGetItems(cancelChallanItemIds, session);
                const cancelChallanProductUpdates = {};
                for (const lineItem of docToCancel.items) {
                    if (lineItem.itemId) {
                        const itemDoc = cancelChallanItemsMap.get(lineItem.itemId.toString());
                        if (itemDoc && itemDoc.type === 'product' && itemDoc.product) {
                            const productId = itemDoc.product.toString();
                            cancelChallanProductUpdates[productId] = (cancelChallanProductUpdates[productId] || 0) + Number(lineItem.quantity);
                        }
                    }
                }
                for (const [productId, change] of Object.entries(cancelChallanProductUpdates)) {
                    await Product.findByIdAndUpdate(productId, { $inc: { currentQuantity: change } }, { session });
                }
            }
        } else if (model === CreditNote) {
            // Credit Note increased stock on create (sales return) — reduce it back
            if (docToCancel.items && docToCancel.items.length > 0) {
                const cancelCNItemIds = docToCancel.items.filter(i => i.itemId).map(i => i.itemId);
                const cancelCNItemsMap = await batchGetItems(cancelCNItemIds, session);
                const cancelCNProductUpdates = {};
                for (const lineItem of docToCancel.items) {
                    if (lineItem.itemId) {
                        const itemDoc = cancelCNItemsMap.get(lineItem.itemId.toString());
                        if (itemDoc && itemDoc.type === 'product' && itemDoc.product) {
                            const productId = itemDoc.product.toString();
                            cancelCNProductUpdates[productId] = (cancelCNProductUpdates[productId] || 0) - Number(lineItem.quantity);
                        }
                    }
                }
                for (const [productId, change] of Object.entries(cancelCNProductUpdates)) {
                    await Product.findByIdAndUpdate(productId, { $inc: { currentQuantity: change } }, { session });
                }
            }
            // Credit Note decreased party balance on create — restore it
            if (docToCancel.partyId) {
                const amount = Number(docToCancel.grandTotal) || 0;
                if (amount !== 0) {
                    await Party.findByIdAndUpdate(docToCancel.partyId, { $inc: { currentBalance: amount } }, { session });
                }
            }
        }
        // SaleOrder, ProformaInvoice, Estimate have no stock/balance side effects to revert

        docToCancel.status = 'Cancelled';
        await docToCancel.save({ session });

        await session.commitTransaction();
        session.endSession();
        res.json({ message: 'Cancelled successfully', doc: docToCancel });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    cancelSale,
    createSale,
    getSales,
    getSaleById,
    updateSale,
    deleteSale,
    convertToInvoice,
    processReturn
};