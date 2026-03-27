const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/partyGroupController');

// Specific routes before parameterized routes
router.get('/parties', ctrl.getPartiesByGroup);
router.post('/move-party', ctrl.movePartyToGroup);

router.get('/', ctrl.getGroups);
router.post('/', ctrl.createGroup);
router.put('/:id', ctrl.updateGroup);
router.delete('/:id', ctrl.deleteGroup);

module.exports = router;
