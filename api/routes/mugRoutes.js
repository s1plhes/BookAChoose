const express = require('express');
const router = express.Router();
const mugController = require('../controllers/mugController');

router.get('/mugs', mugController.getMugs);
router.get('/mugs/:id', mugController.getMugById);
router.post('/mugs/create', mugController.createMug);
router.put('/mugs/:id', mugController.updateMug);
router.delete('/mugs/:id', mugController.deleteMug);

module.exports = router;
