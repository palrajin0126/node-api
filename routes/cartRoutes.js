const express = require('express');
const router = express.Router();
const cartController = require('../controller/cartController');

router.post('/add-to-cart', (req, res) => {
  cartController.addProductToCart(req, res);
});

router.post('/remove-from-cart', (req, res) => {
  cartController.removeProductFromCart(req, res);
});

router.post('/update-cart-quantity', (req, res) => {
  cartController.updateCartQuantity(req, res);
});

module.exports = router;
