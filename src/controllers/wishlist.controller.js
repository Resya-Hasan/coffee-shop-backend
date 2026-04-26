const { WishList } = require('../models');

module.exports = class wishlistController {
    static async getWishlist(req, res, next) {
        try {
            const userId = req.user.id;
            const wishlistItems = await WishList.findAll({ where: { userId } });

            res.status(200).json({
                success: true,
                message: 'Wishlist retrieved successfully',
                data: wishlistItems
            });
        } catch (err) {
            next(err);
        }
    }
}