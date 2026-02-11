const express = require('express');
const router = express.Router();

const UserController = require('../controller/user.controllers');

router.get('/profile', UserController.getProfile);

module.exports = router;