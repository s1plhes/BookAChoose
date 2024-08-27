const express = require('express');
const router = express.Router();
const teeController = require('../controllers/teeController');

router.get('/tees', teeController.getTShirts);
router.get('/tee/:id', teeController.getTShirtById);
router.post('/tee/create', teeController.createTShirt);
router.put('/tee/:id', teeController.updateTShirt);
router.delete('/tee/:id', teeController.deleteTShirt);

module.exports = router;
