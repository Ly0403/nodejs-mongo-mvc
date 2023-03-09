const Order = require("../models/Order");
const Counter = require("../models/Counter");
const logger=require('./loggercontroller');

const orderAdd = (req, res) => {
  const { customerId, productId, orderAmount } = req.body;
  if (customerId == "" || productId == "" || orderAmount == "") {
    res.send("Do not leave blank");
  } else {
    Counter.findOne({ _id: "orderId" }).then((data) => {
      count = data.sequence_value + 1;
      Counter.findOneAndUpdate(
        { _id: "orderId" },
        { sequence_value: count }
      ).then(() => {
        const newOrder = new Order({
          _id: count,
          customerId,
          productId,
          orderAmount,
        });
        newOrder
          .save()
          .then(res.send("Order is added"))
          .catch((err) => logger.errorLog(err));
      });
    });
  }
};

const listOrders = (req, res) => {
  Order.find({}).then((orders) => {
    res.header("Content-Type", "application/json");
    res.send(JSON.stringify(orders, null, 4));
  });
};

const listOrdersById = (req, res) => {
  Order.find({ _id: req.params.id }).then((orders) => {
    res.header("Content-Type", "application/json");
    res.send(JSON.stringify(orders, null, 4));
  });
};

const listOrdersToView = (req, res) => {
  Order.find({}).then((orders) => {
    res.render("order", {
      orderList: orders,
      user: req.user,
    });
  });
};

module.exports = { orderAdd, listOrders, listOrdersById, listOrdersToView };
