const Cart = require("../schema/cart.schema");
const Product = require("../schema/product.schema");
const STATIC_MESSAGE = require('../constants/message.constant');

exports.addProductInCart = async function addProductInCart(req, res) {
    try {
        const { productId, quantity } = req.body;
        const product = await Product.findById(productId);
        if (!product) {
            res.status(STATIC_MESSAGE.statusCode.notFound).send({
                message: STATIC_MESSAGE.errorMessage.productNotFound,
                error: [error],
            });
            return;
        }

        let cartItem = await Cart.findOne({ productId });

        if (cartItem) {
            cartItem.quantity += quantity;
        } else {
            cartItem = new Cart({ productId, quantity });
        }

        await cartItem.save();
        res.status(STATIC_MESSAGE.statusCode.success).send({
            message: STATIC_MESSAGE.successMessage.productAddedToCart,
        });
    } catch (error) {
        res.status(STATIC_MESSAGE.statusCode.badRequest).send({
            message: STATIC_MESSAGE.errorMessage.badRequest,
            error: [error],
        });
    }
};

exports.updateProductInCart = async function updateProductInCart(req, res) {
    try {
        const itemId = req.params.id;
        const { quantity, type } = req.body;

        const cartDetail = await Cart.findById({ _id: itemId });
        if (!cartDetail) {
            res.status(STATIC_MESSAGE.statusCode.notFound).send({
                message: STATIC_MESSAGE.errorMessage.productNotFound,
                error: [error],
            });
            return;
        }
        let updatedQuantity;
        if (type == 'add') {
            updatedQuantity = cartDetail.quantity + quantity;
        } else {
            updatedQuantity = cartDetail.quantity - quantity;
        }
        if (updatedQuantity <= 0) {
            res.status(STATIC_MESSAGE.statusCode.notFound).send({
                message: STATIC_MESSAGE.errorMessage.minQuantity,
                error: [error],
            });
            return;
        }
        await Cart.findByIdAndUpdate(itemId, { quantity: updatedQuantity });

        res.status(STATIC_MESSAGE.statusCode.success).send({
            message: STATIC_MESSAGE.successMessage.productUpdatedInCart,
        });
    } catch (error) {
        res.status(STATIC_MESSAGE.statusCode.badRequest).send({
            message: STATIC_MESSAGE.errorMessage.badRequest,
            error: [error],
        });
    }
};

exports.deleteProductFromCart = async function deleteProductFromCart(req, res) {
    try {
        await Cart.findOneAndDelete({ _id: req.params.id });
        res.status(STATIC_MESSAGE.statusCode.success).send({
            message: STATIC_MESSAGE.successMessage.productDeleted
        });
    } catch (error) {
        res.status(STATIC_MESSAGE.statusCode.badRequest).send({
            message: STATIC_MESSAGE.errorMessage.badRequest,
            error: [error],
        });
    }
};

exports.getCart = async function getCart(req, res) {
    try {
        const cartItems = await Cart.find();

        const productList = cartItems.map(item => item.productId);

        const cartProduct = await Product.find({ _id: { $in: productList } });

        const cartList = cartItems.map(item => {
            const product = cartProduct.find(p => p._id.equals(item.productId));
            return {
                productId: item.productId,
                quantity: item.quantity,
                id: item._id,
                productDetails: product
            };
        });
        res.status(STATIC_MESSAGE.statusCode.success).send({
            message: "Cart list get successfully!",
            data: cartList,
        });
    } catch (error) {
        res.status(STATIC_MESSAGE.statusCode.badRequest).send({
            message: STATIC_MESSAGE.errorMessage.badRequest,
            error: [error],
        });
    }
};