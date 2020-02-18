const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        required: true
    },
    display: {
        type: Boolean,
        default: true
    }
});

const Product = mongoose.model('Product', ProductSchema);

module.exports = Product;