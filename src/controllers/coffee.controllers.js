const { Coffee, Category } = require('../models');

module.exports = class CoffeeController {
    static async getAllCoffees(req, res, next) {
        try {
            const coffees = await Coffee.findAll({
                order: [['createdAt', 'DESC']],
            });

            res.status(200).json({
                status: "success",
                message: "Coffees retrieved successfully",
                data: coffees,
            });
        } catch (err) {
            next(err);
        }
    }

    static async getCoffeeById(req, res, next) {
        try {
            const { id } = req.params;

            const coffee = await Coffee.findByPk(id);

            if (!coffee) {
                throw {
                    name: "not_found",
                    message: "Coffee not found",
                };
            }

            res.status(200).json({
                status: "success",
                message: "Coffee retrieved successfully",
                data: coffee,
            });
        } catch (err) {
            next(err);
        }
    }

    static async createCoffee(req, res, next) {
        try {
            const { name, description, productInformation, price, stock, categoryId } = req.body;

            const category = await Category.findByPk(categoryId);
            if (!category) {
                throw {
                    name: "not_found",
                    message: "Category not found",
                };
            }

            const slug = name.toLowerCase()
                .replace(/\s+/g, "-")
                .replace(/[^\w-]+/g, "");

            const coffee = await Coffee.create({
                name,
                description,
                productInformation,
                price,
                stock,
                categoryId,
                slug,
            });

            res.status(201).json({
                status: "success",
                message: "Coffee created successfully",
                data: coffee,
            });
        } catch (err) {
            next(err);
        }
    }
}