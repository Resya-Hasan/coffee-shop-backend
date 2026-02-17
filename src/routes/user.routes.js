const express = require('express');
const router = express.Router();

const UserController = require('../controller/user.controllers');
const { uploadSingle } = require('../middlewares/uploadwrapper.middleware');

router.get('/profile', UserController.getProfile);
router.put('/profile', UserController.updateProfile);
router.patch('/profile', (req, res, next) => {
    console.log('middleware pertama masuk');
    next();
},uploadSingle('image'), UserController.updateFotoProfile);

module.exports = router;