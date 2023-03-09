const express = require("express");
const { checkauth } = require("./authcontroller");
const router = express.Router();
const {
  customerAdd,
  listCustomers,
  listCustomersById,
  listCustomersToView,
} = require("./customercontroller");
const {
  productAdd,
  listProducts,
  listProductsById,
  listProductsToView,
} = require("./productcontroller");
const {
  orderAdd,
  listOrders,
  listOrdersById,
  listOrdersToView,
} = require("./ordercontroller");

const {
  sendRegisterPage,
  performRegistration,
  verifyEmail,
} = require("./registercontroller");
const {
  sendLoginPage,
  performLogin,
  performLogout,
  sendforgetPasswordPage,
  performForgetPassword,
  sendRefreshPasswordPage,
  performRefreshPassword
} = require("./logincontroller");

const {sendProfilePage,updateProfile}=require('./profilecontroller');

router.get("/", checkauth, (req, res) => {
  res.render("home", { user: req.user });
});

router.post("/addCustomer", checkauth, customerAdd);
router.post("/addProduct", checkauth, productAdd);
router.post("/addOrder", checkauth, orderAdd);

router.get("/api/v1/customers", listCustomers);
router.get("/api/v1/products", listProducts);
router.get("/api/v1/orders", listOrders);

router.get("/api/v1/customers/:id", checkauth, listCustomersById);
router.get("/api/v1/products/:id", checkauth, listProductsById);
router.get("/api/v1/orders/:id", checkauth, listOrdersById);

router.get("/customers", checkauth, listCustomersToView);
router.get("/products", checkauth, listProductsToView);
router.get("/orders", checkauth, listOrdersToView);

router.get("/register", sendRegisterPage);
router.post("/register", performRegistration);
router.get("/verify", verifyEmail);

router.get("/login", sendLoginPage);
router.get("/logout", performLogout);
router.post("/login", performLogin);

router.get("/forgetPassword", sendforgetPasswordPage);
router.post("/forgetPassword", performForgetPassword);
router.get("/refreshPassword", sendRefreshPasswordPage);
router.post("/refreshPassword", performRefreshPassword);

router.get("/profile",checkauth, sendProfilePage);
router.post("/profile",checkauth, updateProfile);

module.exports = router;
