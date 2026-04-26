const { WishList, Product } = require('../models');

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

    static async addToWishlist(req, res, next) {
        try {
            const userId = req.user.id;
            const { productId } = req.body;

            const product = await Product.findByPk(productId);
            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: 'Product not found'
                });
            }

            const existingItem = await WishList.findOne({ where: { userId, productId } });
            if (existingItem) {
                return res.status(400).json({
                    success: false,
                    message: 'Product already in wishlist'
                });
            }

            const newItem = await WishList.create({ userId, productId });

            res.status(201).json({
                success: true,
                message: 'Product added to wishlist',
                data: newItem
            });
        } catch(err) {
            next(err)
        }
    }

    static async removeFromWishlist(req, res, next) {
        try {
            const userId = req.user.id;
            const { productId } = req.params;

            const item = await WishList.findOne({ where: { userId, productId } });
            if (!item) {
                return res.status(404).json({
                    success: false,
                    message: 'Product not found in wishlist'
                });
            }

            await item.destroy();

            res.status(200).json({
                success: true,
                message: 'Product removed from wishlist'
            });
        } catch(err) {
            next(err)
        }
    }
}