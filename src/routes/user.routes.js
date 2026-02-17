const express = require('express');
const router = express.Router();

const UserController = require('../controller/user.controllers');
const upload = require('../middlewares/upload.middleware');

router.get('/profile', UserController.getProfile);
router.put('/profile', UserController.updateProfile);
router.patch('/profile', upload.single('image'), UserController.updateFotoProfile);

module.exports = router;