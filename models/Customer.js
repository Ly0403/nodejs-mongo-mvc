const mongoose = require("mongoose");

const CustomerSchema = new mongoose.Schema({
  _id: {
    type: Number,
    required:true
  },
  customerName: {
    type: String,
    required: true,
  },
  customerSurname: {
    type: String,
    required: true,
  },
});

const Customer = mongoose.model("customers", CustomerSchema);

module.exports = Customer;
