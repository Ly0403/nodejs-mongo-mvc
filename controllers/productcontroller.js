const Product = require("../models/Product");
const Counter = require("../models/Counter");

const productAdd = (req, res) => {
  const { productName, price, stock } = req.body;
  if (productName == "" || price == "" || stock == "") {
    res.send("Do not leave blank");
  } else {
    Counter.findOne({ _id: "productId" }).then((data) => {
      count = data.sequence_value + 1;
      Counter.findOneAndUpdate(
        { _id: "productId" },
        { sequence_value: count }
      ).then(() => {
        const newProduct = new Product({
          _id: count,
          productName,
          price,
          stock,
        });
        newProduct
          .save()
          .then(res.send("Product is added"))
          .catch((err) => logger.errorLog(err));
      });
    });
  }
};

const listProducts = (req, res) => {
  Product.find({}).then((products) => {
    res.header("Content-Type", "application/json");
    res.send(JSON.stringify(products, null, 4));
  });
};

const listProductsById = (req, res) => {
  Product.find({ _id: req.params.id }).then((products) => {
    res.header("Content-Type", "application/json");
    res.send(JSON.stringify(products, null, 4));
  });
};

const listProductsToView = (req, res) => {
  Product.find({}).then((products) => {
    res.render("product", {
      productList: products,
      user: req.user,
    });
  });
};

module.exports = {
  productAdd,
  listProducts,
  listProductsById,
  listProductsToView,
};
