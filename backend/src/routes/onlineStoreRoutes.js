const express = require('express');
const router = express.Router();
const c = require('../controllers/onlineStoreController');

router.get('/items', c.getItems);
router.post('/items', c.createItem);
router.post('/items/bulk-add', c.bulkAddFromInventory);
router.put('/items/:id', c.updateItem);
router.delete('/items/:id', c.deleteItem);
router.get('/categories', c.getCategories);

module.exports = router;
