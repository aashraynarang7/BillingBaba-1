const express = require('express');
const router = express.Router();
const itemController = require('../controllers/itemController');
const upload = require('../middleware/uploadMiddleware');

const uploadFields = upload.fields([
    { name: 'images', maxCount: 5 }
]);

router.post('/', uploadFields, itemController.createItem);
router.get('/', itemController.getItems);
router.get('/bulk/data', itemController.getBulkItemData);
router.get('/bulk/inactive-data', itemController.getInactiveItemData);
router.post('/bulk/inactive', itemController.bulkInactive);
router.post('/bulk/active', itemController.bulkActive);
router.post('/bulk/assign-code', itemController.bulkAssignCode);
router.get('/:id', itemController.getItemById);
router.put('/:id', uploadFields, itemController.updateItem);
router.delete('/:id', itemController.deleteItem);
router.get('/:id/transactions', itemController.getItemTransactions);

module.exports = router;
