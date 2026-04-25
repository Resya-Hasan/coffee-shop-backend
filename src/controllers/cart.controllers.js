const { Cart, CartItem, Product } = require('../models');

module.exports = class CartController {
    static async getCart (req, res, next) {
        try {
            const userId = req.user.id;

            let cart = await Cart.findAll({
                where: { userId },
                include: {
                    model: CartItem,
                    include: {
                        model: Product,
                        attributes: ['id', 'name', 'price']
                    }
                }
            })

            res.status(200).json({
                status: "success",
                data: cart
            });
        } catch(err) {
            next(err)
        }
    }

    static async addToCart(req, res, next) {
        try {
            const { productId } = req.body;
            const userId = req.user.id;

            const product = await Product.findByPk(productId);

            if (!product) {
                throw {
                    name: "not_found",
                    message: "Product not found"
                }
            }

            let cart = await Cart.findOne({ where: { userId } });

            if (!cart) {
                cart = await Cart.create({ userId });
            }

            const existingCartItem = await CartItem.findOne({
                where: {
                    cartId: cart.id,
                    productId: product.id
                }
            })

            if (existingCartItem) {
                await existingCartItem.update({ quantity: existingCartItem.quantity + 1 });
                res.status(200).json({
                    status: "success",
                    message: "Product quantity updated in cart",
                    data: existingCartItem
                });
                return;
            }

            const cartItem = await CartItem.create({
                userId: userId,
                cartId: cart.id,
                productId: product.id,
                quantity: 1
            })

            res.status(201).json({
                status: "success",
                message: "Product added to cart",
                data: cartItem
            });
        } catch (err) {
            next(err)
        }
    }
}