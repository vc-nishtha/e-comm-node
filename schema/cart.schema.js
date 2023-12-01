const mongoose = require('mongoose');
const CartSchema = new mongoose.Schema({
    productId: {
        type: String,
        required: true,
    },
    quantity: {
        type: Number,
        required: false
    },
});

const Cart = mongoose.model('cart', CartSchema);
module.exports = Cart;