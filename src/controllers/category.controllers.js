const { Category } = require('../models');

module.exports = class CategoryController {
    static async getAllCategories(req, res, next) {
        try {
            const categories = await Category.findAll ({
                order: [['createdAt', 'DESC']]
            });

            res.status(200).json({
                status: "success",
                message: "Categories retrieved successfully",
                data: categories,
            });

        } catch (err) {
            next(err)
        }
    }
}