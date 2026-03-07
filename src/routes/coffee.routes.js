const express = require('express');
const router = express.Router();

const CoffeeController = require('../controllers/coffee.controllers');
const authorizationMiddleware = require('../middlewares/authorization.middleware');
const authenticationMiddleware = require('../middlewares/authentication.middleware');
const { uploadSingle } = require('../middlewares/uploadwrapper.middleware');

router.get('/', CoffeeController.getAllCoffees);

router.use(authenticationMiddleware);

router.post('/', authorizationMiddleware, uploadSingle("image"), CoffeeController.createCoffee);
router.get('/:id', CoffeeController.getCoffeeById);
router.put('/:id', authorizationMiddleware, uploadSingle, CoffeeController.updateCoffee);
router.delete('/:id', authorizationMiddleware, CoffeeController.deleteCoffee);

module.exports = router;