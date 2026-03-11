const express = require('express');
const router = express.Router();

const ProductController = require('../controllers/product.controllers');
const authorizationMiddleware = require('../middlewares/authorization.middleware');
const authenticationMiddleware = require('../middlewares/authentication.middleware');
const { uploadSingle } = require('../middlewares/uploadwrapper.middleware');

router.get('/', ProductController.getAllProducts);

router.use(authenticationMiddleware);

router.post('/', authorizationMiddleware, uploadSingle("image"), ProductController.createProduct);
router.get('/:id', ProductController.getProductById);
router.put('/:id', authorizationMiddleware, uploadSingle, ProductController.updateProduct);
router.delete('/:id', authorizationMiddleware, ProductController.deleteProduct);

module.exports = router;