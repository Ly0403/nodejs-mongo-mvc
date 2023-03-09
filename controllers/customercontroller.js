const Customer = require("../models/Customer");
const Counter = require("../models/Counter");
const logger=require('./loggercontroller');

const customerAdd = (req, res) => {
  const { name, surname } = req.body;
  if (name == "" || surname == "") {
    res.send("Do not leave blank");
  } else {
    let count = 0;
    Counter.findOne({ _id: "customerId" }).then((data) => {
      count = data.sequence_value + 1;
      Counter.findOneAndUpdate(
        { _id: "customerId" },
        { sequence_value: count }
      ).then(() => {
        const newCustomer = new Customer({
          _id: count,
          customerName:name,
          customerSurname:surname,
        });

        newCustomer
          .save()
          .then(
            (customer)=>{
              if(customer!=null){
                res.send("Customer is Added")
              }
              else{
                res.send("Error")
              }
            }
          )
          .catch((err) => logger.errorLog(err));
      });
    });
  }
};

const listCustomers = (req, res) => {
  Customer.find({}).then((customers) => {
    res.header("Content-Type", "application/json");
    res.send(JSON.stringify(customers, null, 4));
  });
};

const listCustomersToView = (req, res) => {
  Customer.find({}).then((customers) => {
    res.render("customer", {
      customerList: customers,
      user: req.user,
    });
  });
};

const listCustomersById = (req, res) => {
  Customer.find({ _id: req.params.id }).then((customers) => {
    res.header("Content-Type", "application/json");
    res.send(JSON.stringify(customers, null, 4));
  });
};

module.exports = {
  customerAdd,
  listCustomers,
  listCustomersById,
  listCustomersToView,
};
