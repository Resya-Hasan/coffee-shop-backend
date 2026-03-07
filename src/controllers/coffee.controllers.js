const { Coffee, Category, CoffeeImage } = require('../models');
const cloudinary = require('../config/cloudinary.config')
const streamifier = require('streamifier')

module.exports = class CoffeeController {
    static async getAllCoffees(req, res, next) {
        try {
            const coffees = await Coffee.findAll({
                order: [['createdAt', 'DESC']],
                include: {
                    model: CoffeeImage,
                }
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
            const image = req.file

            if (!image) {
                throw {
                    name: "bad_request",
                    message: "Image file is required",
                    errors: [{
                        field: "image",
                        message: "Image file is required"
                    }]
                }
            }

            let imageUrl = null;

            const result = await new Promise((resolve, reject) => {
                const strem = cloudinary.uploader.upload_stream(
                    { folder: "coffee-images" },
                    (err, result) => {
                        if (result) resolve(result)
                        else reject(err)
                    }
                )

                streamifier
                    .createReadStream(image.buffer)
                    .pipe(strem)
            })

            imageUrl = result.secure_url;

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

            const coffeeImage = await CoffeeImage.create({
                imgUrl: imageUrl,
                coffeeId: coffee.id,
            });

            res.status(201).json({
                status: "success",
                message: "Coffee created successfully",
                data: {
                    coffee,
                    coffeeImage
                },
            });
        } catch (err) {
            next(err);
        }
    }

    static async updateCoffee(req, res, next) {
        try {
            const { id } = req.params;

            const coffee = await Coffee.findByPk(id);
            if (!coffee) {
                throw {
                    name: "not_found",
                    message: "Coffee not found",
                };
            }

            if (req.body.categoryId) {
                const category = await Category.findByPk(req.body.categoryId);
                if (!category) {
                    throw {
                        name: "not_found",
                        message: "Category not found",
                    };
                }
            }

            const updateData = {
                ...coffee.toJSON(),
                ...req.body,
            }

            updateData.slug = updateData.name.toLowerCase()
                .replace(/\s+/g, "-")
                .replace(/[^\w-]+/g, "");

            await coffee.update(updateData);

            res.status(200).json({
                status: "success",
                message: "Coffee updated successfully",
                data: coffee,
            });
        } catch (err) {
            next(err);
        }

    }

    static async deleteCoffee(req, res, next) {
        try {
            const { id } = req.params;

            const coffee = await Coffee.findByPk(id);
            if (!coffee) {
                throw {
                    name: "not_found",
                    message: "Coffee not found",
                };
            }

            await coffee.destroy();

            res.status(200).json({
                status: "success",
                message: "Coffee deleted successfully",
            });
        } catch (err) {
            next(err)
        }
    }
}