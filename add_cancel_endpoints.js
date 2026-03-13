const fs = require('fs');

// Sale Controller
let saleCtrlPath = './backend/src/controllers/saleController.js';
let saleCtrl = fs.readFileSync(saleCtrlPath, 'utf8');

const cancelSaleFunc = `
const cancelSale = async (req, res) => {
    try {
        let docToCancel = await SaleInvoice.findById(req.params.id);
        let model = SaleInvoice;

        if (!docToCancel) { docToCancel = await SaleOrder.findById(req.params.id); model = SaleOrder; }
        if (!docToCancel) { docToCancel = await ProformaInvoice.findById(req.params.id); model = ProformaInvoice; }
        if (!docToCancel) { docToCancel = await Estimate.findById(req.params.id); model = Estimate; }
        if (!docToCancel) { docToCancel = await DeliveryChallan.findById(req.params.id); model = DeliveryChallan; }
        if (!docToCancel) { docToCancel = await CreditNote.findById(req.params.id); model = CreditNote; }

        if (!docToCancel) {
            return res.status(404).json({ message: 'Sale Document not found' });
        }

        if (docToCancel.status === 'Cancelled') {
            return res.status(400).json({ message: 'Document is already cancelled' });
        }

        // Revert Stock (only for invoices/challans if they deducted stock previously)
        if (model === SaleInvoice) {
            if (docToCancel.items && docToCancel.items.length > 0) {
                for (const lineItem of docToCancel.items) {
                    if (lineItem.itemId) {
                        const itemDoc = await Item.findById(lineItem.itemId);
                        if (itemDoc && itemDoc.type === 'product' && itemDoc.product) {
                            await Product.findByIdAndUpdate(itemDoc.product, { $inc: { 'currentQuantity': Number(lineItem.quantity) } });
                        }
                    }
                }
            }

            // Revert Party Balance
            if (docToCancel.paymentType === 'Credit' && docToCancel.partyId) {
                const netDue = (docToCancel.grandTotal || 0) - (docToCancel.receivedAmount || 0);
                if (netDue !== 0) {
                    await Party.findByIdAndUpdate(docToCancel.partyId, { $inc: { currentBalance: -netDue } });
                }
            }
        }

        docToCancel.status = 'Cancelled';
        await docToCancel.save();

        res.json({ message: 'Cancelled successfully', doc: docToCancel });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
`;

if (!saleCtrl.includes('cancelSale')) {
    saleCtrl = saleCtrl.replace('module.exports = {', cancelSaleFunc + '\nmodule.exports = {\n    cancelSale,');
    fs.writeFileSync(saleCtrlPath, saleCtrl);
}

// Purchase Controller
let purchaseCtrlPath = './backend/src/controllers/purchaseController.js';
let purchaseCtrl = fs.readFileSync(purchaseCtrlPath, 'utf8');

const cancelPurchaseFunc = `
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
        } else if (purchase.isBill) {
            // 1. Revert Stock
            if (purchase.items && purchase.items.length > 0) {
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
`;

if (!purchaseCtrl.includes('cancelPurchase')) {
    purchaseCtrl += '\n' + cancelPurchaseFunc;
    fs.writeFileSync(purchaseCtrlPath, purchaseCtrl);
}

// Sale Routes
let saleRoutesPath = './backend/src/routes/saleRoutes.js';
let saleRoutes = fs.readFileSync(saleRoutesPath, 'utf8');
if (!saleRoutes.includes('cancelSale')) {
    saleRoutes = saleRoutes.replace('deleteSale,', 'deleteSale, cancelSale,');
    saleRoutes = saleRoutes.replace("router.delete('/:id', deleteSale);", "router.delete('/:id', deleteSale);\nrouter.put('/:id/cancel', cancelSale);");
    fs.writeFileSync(saleRoutesPath, saleRoutes);
}

// Purchase Routes
let purchaseRoutesPath = './backend/src/routes/purchaseRoutes.js';
let purchaseRoutes = fs.readFileSync(purchaseRoutesPath, 'utf8');
if (!purchaseRoutes.includes('cancelPurchase')) {
    purchaseRoutes = purchaseRoutes.replace("router.delete('/:id', purchaseController.deletePurchase);", "router.delete('/:id', purchaseController.deletePurchase);\nrouter.put('/:id/cancel', purchaseController.cancelPurchase);");
    fs.writeFileSync(purchaseRoutesPath, purchaseRoutes);
}

console.log("Backend integration complete.");
