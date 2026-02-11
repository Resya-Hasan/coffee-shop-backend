const express = require('express');
const router = express.Router();
const AuthController = require('../controller/auth.controllers');
const validate = require('../middlewares/validate');
const { registerSchema, loginSchema } = require('../validations/user.schema');

router.post('/register', validate(registerSchema), AuthController.register);
router.post('/login', validate(loginSchema), AuthController.login);

module.exports = router;