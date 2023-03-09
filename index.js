const express = require("express");
const mongoose = require("mongoose");
const parser = require("body-parser");
const app = express();
const port = 8080;
const passport = require('passport')
const session = require('express-session')
const cookieParser = require('cookie-parser');
const flash = require('express-flash')

app.use(express.static(__dirname + "/node_modules/bootstrap/dist"));
app.use(express.static(__dirname + "/node_modules/axios/dist"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(session({
  secret: "nodejsmvcsecret",
  resave: false ,
  saveUninitialized: true ,
  cookie: {
    expires: 1800000
}
}))
app.use(passport.authenticate('session'));
app.use(cookieParser())
app.use(flash());

mongoose
  .connect("mongodb://127.0.0.1:27017/nodejsmvc", {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(() => console.log("MongoDB is Alive..."))
  .catch((err) => console.log(err));

app.set("view engine", "ejs");

app.use("/", require("./controllers/routecontroller"));
app.listen(port, console.log("Server is listening on port" + port));



