const express = require('express');
const orderController = require('../controller/orderController');
const router = express.Router();

router.post('/place-order', orderController.placeOrder);
router.get('/:id', orderController.getOrderById);
router.delete('/:id', orderController.deleteOrder);
router.get('/user/:userId', orderController.getOrdersByUserId); // New route to fetch orders by user ID

module.exports = router;
