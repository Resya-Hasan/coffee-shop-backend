const express = require('express');
const router = express.Router();

const CoffeeController = require('../controllers/coffee.controllers');
const authorizationMiddleware = require('../middlewares/authorization.middleware');

router.get('/', CoffeeController.getAllCoffees);
router.post('/', authorizationMiddleware, CoffeeController.createCoffee);
router.get('/:id', CoffeeController.getCoffeeById);
// router.put('/:id', authorizationMiddleware, CoffeeController.updateCoffee);
// router.delete('/:id', authorizationMiddleware, CoffeeController.deleteCoffee);

module.exports = router;