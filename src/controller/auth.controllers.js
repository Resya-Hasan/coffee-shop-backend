const { registerSchema } = require('../validations/user.schema');
const { User } = require('../models');
const { generateToken } = require('../utils/jwt');
const { comparePassword } = require('../utils/bcrypt');

module.exports = class AuthController {
    static async register(req, res, next) {
        try {
            const { name, email, password } = req.body;

            const user = await User.findOne({ where: { email } });

            if (user) {
                throw {
                    name: "conflict",
                    message: "Conflict Error",
                    errors: [{
                        field: "email",
                        message: "Email already exists",
                    }]
                };
            }

            const newUser = await User.create(
                { name, email, password }
            )

            res.status(201).json({
                message: "Registration successful",
                data: {
                    id: newUser.id,
                    name: newUser.name,
                    email: newUser.email,
                }
            })

        } catch (err) {
            next(err)
        }
    }

    static async login(req, res, next) {
        try {
            const { email, password } = req.body;

            const user = await User.findOne({ where: { email }});

            if (!user) {
                throw {
                    name: "unauthorized",
                    message: "Invalid email or password"
                }
            }

            const isValidPassword = comparePassword(password, user.password)

            if (!isValidPassword) {
                throw {
                    name: "unauthorized",
                    message: "Invalid email or password"
                }
            }

            const token = generateToken({ id: user.id, email: user.email });

            res.status(200).json({
                message: "login successful",
                token
            })
        } catch (err) {
            next(err)
        }
    }
}