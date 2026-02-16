const express = require('express');
const router = express.Router();

const UserController = require('../controller/user.controllers');

router.get('/profile', UserController.getProfile);
router.put('/profile', UserController.updateProfile);

module.exports = router;