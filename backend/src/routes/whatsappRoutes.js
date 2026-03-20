const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/whatsappController');

router.get('/status', ctrl.getStatus);
router.get('/qr', ctrl.getQR);
router.post('/connect', ctrl.connect);
router.post('/send', ctrl.sendMessage);
router.post('/send-bulk', ctrl.sendBulk);
router.post('/logout', ctrl.logout);

module.exports = router;
