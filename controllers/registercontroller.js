const User = require("../models/User");
const utilities = require("./utilities");
const randtoken = require("rand-token");
const logger=require('./loggercontroller');

const sendRegisterPage = (req, res) => {
  res.render("register", { msgForRegistration: "" });
};

const verifyEmail = (req, res) => {
  User.findOneAndUpdate(
    { $and: [{ token: req.query.token }, { verified: 0 }, { tokenused: 0 }] },
    { verified: 1, tokenused: 1 }
  )
    .then((user) => {
      if (user != null) {
        res.render("verified", {});
      } else {
        res.render("register", { msgForRegistration: "Invalid token!!!" });
      }
    })
    .catch((err) => {
      logger.errorLog(err);
      res.redirect("/register");
    });
};

const performRegistration = (req, res) => {
  const { email, username, password } = req.body;
  const encryptedPassword = utilities.encrypt(password);
  const token = randtoken.generate(20);
  utilities.validate(email, username, password, res, () => {
    const newUser = new User({
      email,
      username,
      password: encryptedPassword,
      token,
      tokenused: 0,
    });
    newUser
      .save()
      .then((user) => {
        utilities
          .sendEmail(user.email, user.token, "emailapprove")
          .then(() => {
            res.render("register", {
              msgForRegistration:
                "Kaydınız Başarılı " +
                user.email +
                " adresinize onay emaili gönderildi.",
            });
          })
          .catch((err) => {
            logger.errorLog(err);
          });
      })
      .catch((err) => {
        logger.errorLog(err);
      });
  });
};

module.exports = { sendRegisterPage, performRegistration, verifyEmail };
