const express = require('express');
const router = express.Router();

const CategoryController = require('../controllers/category.controllers');

router.get('/', CategoryController.getAllCategories);

module.exports = router;