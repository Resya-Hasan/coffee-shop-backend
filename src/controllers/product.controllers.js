const { Product, Category, ProductImage } = require('../models');
const { uploadWithRetry } = require('../helper/cloudinary');

module.exports = class ProductController {
    static async getAllProducts(req, res, next) {
        try {
            const { search } = req.query;

            const where = {}

            if (search) {
                where.name = {
                    [Op.iLike]: `${search}`
                }
            }

            const products = await Product.findAll({
                where,
                order: [['createdAt', 'DESC']],
                include: {
                    model: ProductImage,
                }
            });

            const result = products.map(el => ({
                id: el.id,
                name: el.name,
                description: el.description,
                productInformation: el.productInformation,
                price: el.price,
                stock: el.stock,
                sold: el.sold,
                categoryId: el.categoryId,
                slug: el.slug,
                isActive: el.isActive,
                images: el.ProductImages.map(img => img.imgUrl)
            }))

            res.status(200).json({
                status: "success",
                message: "Products retrieved successfully",
                data: result,
            });
        } catch (err) {
            next(err);
        }
    }

    static async getProductById(req, res, next) {
        try {
            const { id } = req.params;

            const product = await Product.findByPk(id);

            if (!product) {
                throw {
                    name: "not_found",
                    message: "Product not found",
                };
            }

            res.status(200).json({
                status: "success",
                message: "Product retrieved successfully",
                data: product,
            });
        } catch (err) {
            next(err);
        }
    }

    static async createProduct(req, res, next) {
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

            const category = await Category.findByPk(categoryId);
            if (!category) {
                throw {
                    name: "not_found",
                    message: "Category not found",
                };
            }

            const result = await uploadWithRetry(image.buffer, "products-images");

            const slug = name.toLowerCase()
                .replace(/\s+/g, "-")
                .replace(/[^\w-]+/g, "");

            const product = await Product.create({
                name,
                description,
                productInformation,
                price,
                stock,
                categoryId,
                slug,
            });

            const productImage = await ProductImage.create({
                imgUrl: result.secure_url,
                productId: product.id,
            });

            res.status(201).json({
                status: "success",
                message: "Product created successfully",
                data: {
                    product,
                    productImage
                },
            });
        } catch (err) {
            next(err);
        }
    }

    static async updateProduct(req, res, next) {
        try {
            const { id } = req.params;

            const product = await Product.findByPk(id);
            if (!product) {
                throw {
                    name: "not_found",
                    message: "Product not found",
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
                ...product.toJSON(),
                ...req.body,
            }

            updateData.slug = updateData.name.toLowerCase()
                .replace(/\s+/g, "-")
                .replace(/[^\w-]+/g, "");

            await Product.update(updateData);

            res.status(200).json({
                status: "success",
                message: "Product updated successfully",
                data: product,
            });
        } catch (err) {
            next(err);
        }

    }

    static async deleteProduct(req, res, next) {
        try {
            const { id } = req.params;

            const product = await Product.findByPk(id);
            if (!product) {
                throw {
                    name: "not_found",
                    message: "Product not found",
                };
            }

            await Product.destroy();

            res.status(200).json({
                status: "success",
                message: "Product deleted successfully",
            });
        } catch (err) {
            next(err)
        }
    }
}