const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const ctrl = require('../controllers/billParserController');

// POST /api/bill-parser/parse — upload a bill image and get extracted data
router.post('/parse', upload.single('billImage'), ctrl.parseBillImage);

// GET /api/bill-parser/status — check if Ollama is available
router.get('/status', ctrl.checkOllamaStatus);

module.exports = router;
