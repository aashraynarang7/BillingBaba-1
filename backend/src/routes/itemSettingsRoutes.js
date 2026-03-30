const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/itemSettingsController');

router.get('/', ctrl.getItemSettings);
router.put('/', ctrl.updateItemSettings);

module.exports = router;
