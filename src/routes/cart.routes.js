const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cart.controllers');
const authenticationMiddleware = require('../middlewares/authentication.middleware');

router.use(authenticationMiddleware);

router.get('/', cartController.getCart);
router.post('/add', cartController.addToCart);
router.patch("/update/:cartItemId", cartController.updateCartItem);

module.exports = router;