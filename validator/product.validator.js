const Joi = require('joi');

const titleMessages = {
    "string.base": "Title must be a string",
    "string.empty": "Title is required",
    "string.min": "Title must be at least {#limit} characters",
    "string.max": "Title must not exceed {#limit} characters",
    "any.required": "Title is required",
};

const descriptionMessages = {
    "string.base": "Description must be a string",
    "string.empty": "Description is required",
    "string.min": "Description must be at least {#limit} characters",
    "string.max": "Description must not exceed {#limit} characters",
    "any.required": "Description is required",
};

const priceMessages = {
    "number.base": "Price must be a number",
    "number.integer": "Price must be an integer",
    "number.min": "Price must be at least {#limit}",
    "number.max": "Price must not exceed {#limit}",
};

const imageMessages = {
    "string.base": "Product link must be a string",
    "string.empty": "Product link is required",
};

const joiSchema = Joi.object({
    title: Joi.string().min(5).max(50).required().messages(titleMessages),
    description: Joi.string().min(5).max(200).required().messages(descriptionMessages),
    price: Joi.number().min(100).max(5000).required().messages(priceMessages),
    image: Joi.string().required().messages(imageMessages)
});

function validateProduct(req, res, next) {
    joiSchema.validate(req.body);
    next();
}

module.exports = { validateProduct };