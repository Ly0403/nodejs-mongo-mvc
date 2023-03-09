const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  _id: {
    type: Number,
    required:true
  },
  customerId: {
    type: Number,
    required: true,
  },
  productId: {
    type: Number,
    required: true,
  },
  orderAmount: {
    type: Number,
    required: true,
  }
});

const Order = mongoose.model("orders", OrderSchema);

module.exports = Order;
