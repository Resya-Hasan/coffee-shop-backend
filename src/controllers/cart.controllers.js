const { where } = require('sequelize');
const { Cart, CartItem, Product } = require('../models');

module.exports = class CartController {
    static async getCart(req, res, next) {
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
        } catch (err) {
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

    static async updateCartItem(req, res, next) {
        try {
            const { cartItemId } = req.params;
            const { quantity } = req.body;
            const userId = req.user.id;

            const cartItem = await CartItem.findByPk(cartItemId, {
                include: [
                    {
                        model: Product,
                        attributes: ['id', 'name', 'price', 'stock']
                    },
                    {
                        model: Cart,
                        where: { userId }
                    }
                ]
            });

            if (cartItem.Cart.userId !== userId) {
                throw {
                    name: "forbidden",
                    message: "You do not have permission to update this cart item"
                }
            }

            if (quantity <= 0) {
                await cartItem.destroy();
                res.status(200).json({
                    status: "success",
                    message: "Product removed from cart"
                });
            }

            if (quantity > cartItem.Product.stock) {
                throw {
                    name: "bad_request",
                    message: "Quantity exceeds available stock"
                }
            }

            cartItem.quantity = quantity;
            await cartItem.save();

            res.status(200).json({
                status: "success",
                message: "Cart item updated",
                data: {
                    id: cartItem.id,
                    productId: cartItem.productId,
                    quantity: cartItem.quantity,
                    product: {
                        id: cartItem.Product.id,
                        name: cartItem.Product.name,
                        price: cartItem.Product.price
                    }
                }
            });
        } catch (err) {
            next(err)
        }
    }

    static async deleteCartItem(req, res, next) {
        try {
            const { cartItemId } = req.params;
            const userId = req.user.id;

            const cartItem = await CartItem.findByPk(cartItemId, {
                include: {
                    model: Cart,
                    where: { userId }
                }
            });

            if (!cartItem) {
                throw {
                    name: "not_found",
                    message: "Cart item not found"
                }
            }

            if (cartItem.Cart.userId !== userId) {
                throw {
                    name: "forbidden",
                    message: "You do not have permission to delete this cart item"
                }
            }

            await cartItem.destroy();

            res.status(200).json({
                status: "success",
                message: "Cart item deleted"
            });
        } catch (err) {
            next(err)
        }
    }
}