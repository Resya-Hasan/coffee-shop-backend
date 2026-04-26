const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cart.controllers');

router.get('/', cartController.getCart);
router.post('/add', cartController.addToCart);
router.patch("/update/:cartItemId", cartController.updateCartItem);
router.delete("/delete/:cartItemId", cartController.deleteCartItem);

module.exports = router;