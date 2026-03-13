const express = require('express');
const router = express.Router();
const companyController = require('../controllers/companyController');
const upload = require('../middleware/uploadMiddleware');

const authMiddleware = require('../middleware/authMiddleware');

const uploadFields = upload.fields([
    { name: 'logo', maxCount: 1 },
    { name: 'signature', maxCount: 1 }
]);

router.post('/', authMiddleware, uploadFields, companyController.createCompany);
router.get('/', authMiddleware, companyController.getCompanies);
router.get('/:id', authMiddleware, companyController.getCompanyById);
router.put('/:id', authMiddleware, uploadFields, companyController.updateCompany);
router.delete('/:id', authMiddleware, companyController.deleteCompany);

module.exports = router;
