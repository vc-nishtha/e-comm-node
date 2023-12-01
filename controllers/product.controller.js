const Product = require("../schema/product.schema");
const STATIC_MESSAGE = require('../constants/message.constant');

exports.createProduct = async function createProduct(req, res) {
    try {
        const prod = new Product(req.body);
        console.log(prod, 'prod')
        await prod.save();
        res.status(STATIC_MESSAGE.statusCode.success).send({
            message: STATIC_MESSAGE.successMessage.productCreated,
        });
    } catch (error) {
        res.status(STATIC_MESSAGE.statusCode.badRequest).send({
            message: STATIC_MESSAGE.errorMessage.badRequest,
            error: [error],
        });
    }
};

exports.getProductList = async function getProduct(req, res) {
    try {
        const productList = await Product.find();
        res.status(STATIC_MESSAGE.statusCode.success).send({
            message: STATIC_MESSAGE.successMessage.productList,
            data: productList,
        });
    } catch (error) {
        res.status(STATIC_MESSAGE.statusCode.badRequest).send({
            message: STATIC_MESSAGE.errorMessage.badRequest,
            error: [error],
        });
    }
};

exports.getProductDetail = async function getProduct(req, res) {
    try {
        const productDetail = await Product.findById({ _id: req.params.id });
        res.status(STATIC_MESSAGE.statusCode.success).send({
            message: STATIC_MESSAGE.successMessage.productDetail,
            data: productDetail,
        });
    } catch (error) {
        res.status(STATIC_MESSAGE.statusCode.badRequest).send({
            message: STATIC_MESSAGE.errorMessage.badRequest,
            error: [error],
        });
    }
};

exports.updateProduct = async function updateProduct(req, res) {
    try {
        await Product.updateOne({ _id: req.body.id }, req.body);
        res.status(STATIC_MESSAGE.statusCode.success).send({
            message: STATIC_MESSAGE.successMessage.productUpdated
        });
    } catch (error) {
        res.status(STATIC_MESSAGE.statusCode.badRequest).send({
            message: STATIC_MESSAGE.errorMessage.badRequest,
            error: [error],
        });
    }
};

exports.deleteProduct = async function deleteProduct(req, res) {
    try {
        await Product.findOneAndDelete({ _id: req.params.id });
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