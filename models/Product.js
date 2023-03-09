const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  _id: {
    type: Number,
    required:true
  },
  productName: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  stock: {
    type: Number,
    required: true,
  }
});

const Product = mongoose.model("products", ProductSchema);

module.exports = Product;
