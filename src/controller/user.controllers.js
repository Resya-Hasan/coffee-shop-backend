const { User } = require('../models')

module.exports = class UserController {
    static async getProfile(req, res, next) {
        try {
            const userId = req.user.id

            const user = await User.findByPk(userId, {
                attributes: {
                    exclude: ['password', 'createdAt', 'updatedAt']
                }
            })

            if (!user) {
                throw {
                    name: "not_found",
                    message: "User not found"
                }
            }

            res.status(200).json({
                status: "success",
                message: "User profile retrieved successfully",
                data: user
            })
        } catch (err) {
            next(err)
        }
    }

    static async updateProfile(req, res, next) {
        try {
            const userId = req.user.id
            const { name, phoneNumber, address, } = req.body || {}

            const user = await User.findByPk(userId)

            if (!user) {
                throw {
                    name: "not_found",
                    message: "User not found"
                }
            }
            
            if (phoneNumber) {
                const existingUser = await User.findOne({
                    where: {
                        phoneNumber,
                    }
                })

                if (existingUser) {
                    throw {
                        name: "conflict",
                        message: "Phone number already exists",
                        errors: [{
                            field: "phoneNumber",
                            message: "Phone number already exists"
                        }]
                    }
                }
            }

            await User.update(
                { name, phoneNumber, address },
                { where: { id: userId } }
            )

            const updatedUser = await User.findByPk(userId, {
                attributes: {
                    exclude: ['password', 'createdAt', 'updatedAt']
                }
            })

            res.status(200).json({
                status: "success",
                message: "User profile updated successfully",
                data: {
                    updatedUser
                }
            })
        } catch (err) {
            next(err)
        }
    }

    static async updateFotoProfile(req, res, next) {
        try {
            const userId = req.user.id

            res.status(201).json({
                status: "success",
                message: "Foto profile updated successfully",
                data: {
                    userId
                }
            })
        } catch(err) {
            next(err)
        }
    }
}