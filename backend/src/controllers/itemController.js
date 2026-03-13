const mongoose = require('mongoose');
const Item = require('../models/Item');
const Product = require('../models/Product');
const Service = require('../models/Service');
const Category = require('../models/Category');

exports.createItem = async (req, res) => {
    try {
        const { type, name, companyId, ...details } = req.body;

        // --- HANDLE FILE UPLOADS ---
        if (req.files && req.files.images) {
            details.images = req.files.images.map(f => `/uploads/${f.filename}`);
        }

        // Parse nested JSON fields
        ['salePrice', 'purchasePrice', 'discount', 'wholesalePrice'].forEach(field => {
            if (typeof details[field] === 'string') {
                try {
                    details[field] = JSON.parse(details[field]);
                } catch (e) { }
            }
        });

        const itemData = {
            companyId,
            type,
            name
        };

        if (type === 'product') {
            // 1. Create Product
            const productData = { ...details, companyId };
            if (productData.openingQuantity && productData.currentQuantity === undefined) {
                productData.currentQuantity = productData.openingQuantity;
            }
            const product = new Product(productData);
            const savedProduct = await product.save();

            // 2. Link Item to Product
            itemData.product = savedProduct._id;

            // STRICT SEPARATION: We do NOT sync fields to Item anymore.
            // Item is strictly a wrapper/linker.

            const item = new Item(itemData);
            await item.save();

            // 3. Link Item to Category
            if (productData.category) {
                await Category.findOneAndUpdate(
                    { name: productData.category.trim(), companyId },
                    { $addToSet: { items: item._id } },
                    { upsert: true, new: true, setDefaultsOnInsert: true }
                );
            }

            const fullItem = await Item.findById(item._id).populate('product');
            res.status(201).json(fullItem);

        } else if (type === 'service') {
            // 1. Create Service
            const serviceData = { ...details, companyId };

            // Handle legacy mapping if frontend sends 'hsn' for services
            if (serviceData.hsn && !serviceData.sac) serviceData.sac = serviceData.hsn;

            const service = new Service(serviceData);
            const savedService = await service.save();

            // 2. Link Item to Service
            itemData.service = savedService._id;

            const item = new Item(itemData);
            await item.save();

            // 3. Link Item to Category
            if (serviceData.category) {
                await Category.findOneAndUpdate(
                    { name: serviceData.category.trim(), companyId },
                    { $addToSet: { items: item._id } },
                    { upsert: true, new: true, setDefaultsOnInsert: true }
                );
            }

            const fullItem = await Item.findById(item._id).populate('service');
            res.status(201).json(fullItem);

        } else {
            return res.status(400).json({ error: 'Invalid item type' });
        }

    } catch (error) {
        console.error(error);
        res.status(400).json({ error: error.message });
    }
};

exports.getItems = async (req, res) => {
    try {
        const { companyId, type, productId, id } = req.query;
        const filter = {};
        if (companyId) filter.companyId = companyId;
        if (type) filter.type = type;
        if (productId) filter.product = productId;
        if (id) {
            if (Array.isArray(id)) filter._id = { $in: id };
            else filter._id = id;
        }

        // Populate both product and service to get details
        const items = await Item.find(filter)
            .populate('product')
            .populate('service');

        res.json(items);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getItemById = async (req, res) => {
    try {
        const item = await Item.findById(req.params.id)
            .populate('product')
            .populate('service');

        if (!item) return res.status(404).json({ message: 'Item not found' });
        res.json(item);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateItem = async (req, res) => {
    try {
        const { name, ...details } = req.body;

        // --- HANDLE FILE UPLOADS & MERGE ---
        const newImages = req.files && req.files.images ? req.files.images.map(f => `/uploads/${f.filename}`) : [];

        // Parse nested JSON fields
        ['salePrice', 'purchasePrice', 'discount', 'wholesalePrice'].forEach(field => {
            if (typeof details[field] === 'string') {
                try {
                    details[field] = JSON.parse(details[field]);
                } catch (e) { }
            }
        });

        // Merge logic (Append new images to existing list if provided)
        if (newImages.length > 0 || details.images) {
            let existingImages = [];
            if (details.images) {
                if (Array.isArray(details.images)) existingImages = details.images;
                else if (typeof details.images === 'string') {
                    try { existingImages = JSON.parse(details.images); }
                    catch { existingImages = [details.images]; }
                }
            }
            // Ensure we don't accidentally wipe existing if user just uploaded new ones but didn't send old list?
            // Assuming explicit list from frontend. If frontend sends nothing but file, we might lose old.
            // But traditionally update sends everything.
            if (details.images || newImages.length > 0) {
                details.images = [...existingImages, ...newImages];
            }
        }

        const item = await Item.findById(req.params.id);
        if (!item) return res.status(404).json({ message: 'Item not found' });

        if (name) item.name = name;

        if (item.type === 'product' && item.product) {
            await Product.findByIdAndUpdate(item.product, details);
            await item.save(); // Save name change

            // Sync Category
            if (details.category !== undefined) {
                await Category.updateMany(
                    { companyId: item.companyId, items: item._id },
                    { $pull: { items: item._id } }
                );
                if (details.category.trim()) {
                    await Category.findOneAndUpdate(
                        { name: details.category.trim(), companyId: item.companyId },
                        { $addToSet: { items: item._id } },
                        { upsert: true, new: true, setDefaultsOnInsert: true }
                    );
                }
            }
        } else if (item.type === 'service' && item.service) { // Check for Linked Service
            if (details.hsn && !details.sac) details.sac = details.hsn;
            await Service.findByIdAndUpdate(item.service, details);
            await item.save();

            // Sync Category
            if (details.category !== undefined) {
                await Category.updateMany(
                    { companyId: item.companyId, items: item._id },
                    { $pull: { items: item._id } }
                );
                if (details.category.trim()) {
                    await Category.findOneAndUpdate(
                        { name: details.category.trim(), companyId: item.companyId },
                        { $addToSet: { items: item._id } },
                        { upsert: true, new: true, setDefaultsOnInsert: true }
                    );
                }
            }
        } else if (item.type === 'service' && !item.service) {
            // Legacy fallback
            await item.save();
        }

        const updatedItem = await Item.findById(req.params.id)
            .populate('product')
            .populate('service');

        res.json(updatedItem);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.deleteItem = async (req, res) => {
    try {
        const item = await Item.findById(req.params.id);
        if (!item) return res.status(404).json({ message: 'Item not found' });

        // Check if item is used in any transaction before deleting
        const itemObjectId = new mongoose.Types.ObjectId(req.params.id);
        const txQuery = { 'items.itemId': itemObjectId };
        const SaleInvoice = require('../models/SaleInvoice');
        const SaleOrder = require('../models/SaleOrder');
        const ProformaInvoice = require('../models/ProformaInvoice');
        const Estimate = require('../models/Estimate');
        const DeliveryChallan = require('../models/DeliveryChallan');
        const CreditNote = require('../models/CreditNote');
        const Purchase = require('../models/Purchase');
        const PurchaseBill = require('../models/PurchaseBill');
        const DebitNote = require('../models/DebitNote');

        const counts = await Promise.all([
            SaleInvoice.countDocuments(txQuery),
            SaleOrder.countDocuments(txQuery),
            ProformaInvoice.countDocuments(txQuery),
            Estimate.countDocuments(txQuery),
            DeliveryChallan.countDocuments(txQuery),
            CreditNote.countDocuments(txQuery),
            Purchase.countDocuments(txQuery),
            PurchaseBill.countDocuments(txQuery),
            DebitNote.countDocuments(txQuery),
        ]);
        const totalUsed = counts.reduce((a, b) => a + b, 0);
        if (totalUsed > 0) {
            return res.status(400).json({
                message: `This item cannot be deleted as it is already used in ${totalUsed} transaction(s). Please delete all related transactions before deleting this item.`
            });
        }

        if (item.type === 'product' && item.product) {
            await Product.findByIdAndDelete(item.product);
        } else if (item.type === 'service' && item.service) {
            await Service.findByIdAndDelete(item.service);
        }

        // Remove from Category
        await Category.updateMany(
            { companyId: item.companyId, items: item._id },
            { $pull: { items: item._id } }
        );

        await Item.findByIdAndDelete(req.params.id);
        res.json({ message: 'Item deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getItemTransactions = async (req, res) => {
    try {
        const { id } = req.params;
        const { companyId } = req.query;

        const item = await Item.findById(id);
        if (!item) return res.status(404).json({ message: 'Item not found' });

        const targetId = item.product || item.service;

        // Match either the Item Wrapper ID or the internal Product/Service ID
        // Note: Models consistently use 'itemId' to refer to the Item Wrapper.
        // We check key 'items.itemId'.
        const query = {
            'items.itemId': id
        };
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
            SaleInvoice.find(query).populate('partyId', 'name').lean(),
            SaleOrder.find(query).populate('partyId', 'name').lean(),
            ProformaInvoice.find(query).populate('partyId', 'name').lean(),
            Estimate.find(query).populate('partyId', 'name').lean(),
            DeliveryChallan.find(query).populate('partyId', 'name').lean(),
            CreditNote.find(query).populate('partyId', 'name').lean(),
            Purchase.find(query).populate('partyId', 'name').lean(), // Covers PO, Bill
            DebitNote.find(query).populate('partyId', 'name').lean()
        ]);

        const allTransactions = [];

        // Helper to process list
        const processList = (list, typeLabel, dateField, numField, category) => {
            list.forEach(doc => {
                const lineItem = doc.items.find(i => i.itemId && i.itemId.toString() === id);
                if (lineItem) {
                    allTransactions.push({
                        id: doc._id,
                        type: typeLabel, // e.g. 'Sale Invoice'
                        rawType: doc.documentType || typeLabel,
                        number: doc[numField] || '-',
                        partyName: doc.partyId ? doc.partyId.name : (doc.partyName || 'Cash'),
                        date: doc[dateField] || doc.createdAt,
                        quantity: lineItem.quantity,
                        price: lineItem.priceUnit ? lineItem.priceUnit.amount : 0,
                        status: doc.status || 'Generated',
                        category: category // 'Sale' or 'Purchase'
                    });
                }
            });
        };

        // --- MAP SALES ---
        processList(invoices, 'Sale Invoice', 'invoiceDate', 'invoiceNumber', 'Sale');
        processList(orders, 'Sale Order', 'orderDate', 'orderNumber', 'Sale');
        processList(proformas, 'Proforma Invoice', 'invoiceDate', 'refNo', 'Sale');
        processList(estimates, 'Estimate', 'invoiceDate', 'refNo', 'Sale');
        processList(challans, 'Delivery Challan', 'challanDate', 'challanNumber', 'Sale');
        processList(creditNotes, 'Credit Note', 'creditNoteDate', 'returnNo', 'Sale');

        // --- MAP PURCHASES ---
        // Purchase model mixes types
        purchases.forEach(doc => {
            const lineItem = doc.items.find(i => i.itemId && i.itemId.toString() === id);
            if (lineItem) {
                let type = 'Purchase Bill';
                let dateField = 'billDate';
                let numField = 'billNumber';

                if (doc.documentType === 'PO') {
                    type = 'Purchase Order';
                    dateField = 'orderDate';
                    numField = 'orderNumber';
                }

                allTransactions.push({
                    id: doc._id,
                    type: type,
                    rawType: doc.documentType,
                    number: doc[numField] || '-',
                    partyName: doc.partyId ? doc.partyId.name : (doc.partyName || 'Cash'),
                    date: doc[dateField] || doc.createdAt,
                    quantity: lineItem.quantity,
                    price: lineItem.priceUnit ? lineItem.priceUnit.amount : 0,
                    status: doc.status || 'Received',
                    category: 'Purchase'
                });
            }
        });

        processList(debitNotes, 'Debit Note', 'debitNoteDate', 'returnNo', 'Purchase');

        // Sort by date desc
        allTransactions.sort((a, b) => new Date(b.date) - new Date(a.date));

        res.json(allTransactions);

    } catch (error) {
        console.error('Transactions fetch error:', error);
        res.status(500).json({ error: error.message });
    }
};
