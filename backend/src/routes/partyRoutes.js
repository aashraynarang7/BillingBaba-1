const express = require('express');
const router = express.Router();
const partyController = require('../controllers/partyController');
const upload = require('../middleware/uploadMiddleware');

const uploadFields = upload.fields([
    { name: 'image', maxCount: 1 }
]);

router.post('/', uploadFields, partyController.createParty);
router.get('/', partyController.getParties);
router.get('/:id', partyController.getPartyById);
router.put('/:id', uploadFields, partyController.updateParty);
router.delete('/:id', partyController.deleteParty);
router.get('/:id/transactions', partyController.getPartyTransactions);

module.exports = router;
