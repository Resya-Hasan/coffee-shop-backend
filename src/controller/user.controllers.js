

module.exports = class UserController {
    static async getProfile(req, res, next ) {
        try {
            res.status(200).json({
                message: "User profile retrieved successfully",
            })
        } catch(err) {
            next(err)
        }
    }
}