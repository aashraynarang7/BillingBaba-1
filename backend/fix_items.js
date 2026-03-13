const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI).then(async () => {
    const SaleInvoice = require('./src/models/SaleInvoice');
    const SaleOrder = require('./src/models/SaleOrder');
    const ProformaInvoice = require('./src/models/ProformaInvoice');
    const Estimate = require('./src/models/Estimate');
    const DeliveryChallan = require('./src/models/DeliveryChallan');
    const CreditNote = require('./src/models/CreditNote');
    const Purchase = require('./src/models/Purchase');
    const DebitNote = require('./src/models/DebitNote');
    const Item = require('./src/models/Item');

    const models = [
        SaleInvoice, SaleOrder, ProformaInvoice, Estimate,
        DeliveryChallan, CreditNote, Purchase, DebitNote
    ];

    let itemsMap = {};
    const allItems = await Item.find({});
    allItems.forEach(i => {
        itemsMap[i.name.toLowerCase()] = i._id;
    });

    for (const Model of models) {
        let updatedCount = 0;
        const docs = await Model.find({});

        for (const doc of docs) {
            let changed = false;
            for (let i = 0; i < doc.items.length; i++) {
                if (!doc.items[i].itemId && doc.items[i].name) {
                    const mappedId = itemsMap[doc.items[i].name.toLowerCase()];
                    if (mappedId) {
                        doc.items[i].itemId = mappedId;
                        changed = true;
                    } else {
                        const freshItem = await Item.findOne({ name: doc.items[i].name });
                        if (freshItem) {
                            doc.items[i].itemId = freshItem._id;
                            itemsMap[doc.items[i].name.toLowerCase()] = freshItem._id;
                            changed = true;
                        }
                    }
                }
            }
            if (changed) {
                await doc.save();
                updatedCount++;
            }
        }
        console.log(`Updated ${updatedCount} missing itemIds for ${Model.modelName}`);
    }

    process.exit(0);
}).catch(console.error);
