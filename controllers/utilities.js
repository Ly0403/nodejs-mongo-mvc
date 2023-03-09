const crypto = require("crypto");
const nodemailer = require("nodemailer");
const User = require("../models/User");

function encrypt(pass) {
  let salt = "saltforpass".toString("base64");
  let hash = crypto.createHmac("sha512", salt).update(pass).digest("base64");
  return salt + "$" + hash;
}

async function validate(email, username, password, res, myCallback) {
  validate = true;
  if (email == "" || username == "" || password == "") {
    res.render("register", {
      msgForRegistration: "Don't leave blank",
    });
  } else if (password.length < 6) {
    res.render("register", {
      msgForRegistration: "The password should be more than 6 characters",
    });
  } else if (await User.exists({ email: email })) {
    res.render("register", {
      msgForRegistration: "Registered Email",
    });
  } else if (await User.exists({ username: username })) {
    res.render("register", {
      msgForRegistration: "Registered User",
    });
  } else {
    myCallback();
  }
}

async function sendEmail(email, token, reason) {
  const hostAddress="http://nodejsmvc.lytraining2016.tk";
  const mail = nodemailer.createTransport({
    service: "hotmail",
    auth: {
      user: "",
      pass: "",
    },
  });
  if (reason == "emailapprove") {
    mail.sendMail({
      from: "nodejsmvctest@outlook.com",
      to: email,
      subject: "Email Approval",
      html:
        '<p>Please click <a href="'+hostAddress+'/verify?token=' +
        token +
        '">HERE</a> to approve. </p>',
    });
  } else if (reason == "forgetpassword") {
    mail.sendMail({
      from: "nodejsmvctest@outlook.com",
      to: email,
      subject: "Forget Password",
      html:
        '<p>Please click <a href="'+hostAddress+'/refreshpassword?token=' +
        token +
        '">HERE</a> to refresh your password. </p>',
    });
  }
}

module.exports = { encrypt, validate, sendEmail };
