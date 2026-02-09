const { registerSchema } = require('../validations/user.schema');
const { User } = require('../models');
const { generateToken } = require('../utils/jwt');

module.exports = class AuthController {
    static async register(req, res, next) {
        try {
            const data = registerSchema.parse(req.body);

            console.log(data, "<< Register Data");

            const newUser = await User.create(
                data
            )

            res.status(201).json({
                message: "Registration successful",
                data: {
                    id: newUser.id,
                    name: newUser.name,
                    email: newUser.email,
                    token: generateToken(newUser)
                }
            })

        } catch(err) {
            next(err)
        }
    }
}