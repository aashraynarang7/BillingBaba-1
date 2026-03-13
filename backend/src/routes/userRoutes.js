const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// POST /api/users/register - Register a new user
router.post('/register', userController.registerUser);

// GET /api/users - Get all users
router.get('/', userController.getAllUsers);

// Team member routes
router.post('/team', userController.addTeamMember);
router.get('/team', userController.getTeamMembers);
router.delete('/team/:companyId/:memberId', userController.removeTeamMember);

module.exports = router;
