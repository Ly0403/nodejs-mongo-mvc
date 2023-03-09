const { passportlocal } = require("./authcontroller");
const User = require("../models/User");
const utilities = require("./utilities");
const randtoken = require("rand-token");
const logger=require('./loggercontroller');

const sendLoginPage = (req, res) => {
  res.render("login", { msgForLogin: req.flash("error") });
};

const sendforgetPasswordPage = (req, res) => {
  res.render("forgetpassword", { msgForForget: "" });
};

const sendRefreshPasswordPage = (req, res) => {
    User.findOne({ token: req.query.token })
      .then((user) => {
        if(user==null||user.tokenused==1){
          res.render("forgetpassword", { msgForForget: "Invalid token" });
        }
        else{
          res.render("refreshpassword", { msgForRefresh: "", token: req.query.token });
        }
      })
      .catch((err) => {
        res.render("forgetpassword", { msgForForget: "Invalid token" });
      });  
};

const performLogin = (req, res) => {
  const { username, password } = req.body;
  if (username == "" || password == "") {
    res.render("login", { msgForLogin: "Don't leave blank." });
  } else {
    passportlocal.authenticate("local", {
      successRedirect: "/",
      failureRedirect: "/login",
      failureFlash: true,
    })(req, res);
  }
};

const performLogout = (req, res) => {
  req.logOut(() => {
    res.redirect("/login");
  });
};

const performForgetPassword = (req, res) => {
  const { email } = req.body;
  if (email == "") {
    res.render("forgetpassword", { msgForForget: "Don't leave blank." });
  } else {
    User.findOne({ email: email })
      .then((user) => {
        if (user == null) {
          res.render("forgetpassword", {
            msgForForget: "Email is Not Registered!!!",
          });
        } else {
          const token = randtoken.generate(20);
          User.findOneAndUpdate({ email: email }, { token: token,tokenused:0 })
            .then((user) => {
              utilities.sendEmail(email, token, "forgetpassword").then(() => {
                res.render("forgetpassword", {
                  msgForForget:
                    "A link is sent to your email to refresh your password",
                });
              });
            })
            .catch((err) => {
              logger.errorLog(err);
            });
        }
      })
      .catch((err) => {
        logger.errorLog(err);
      });
  }
};

const performRefreshPassword = (req, res) => {
  const { password, repeatpassword, token } = req.body;
  if (password == "" || repeatpassword == "") {
    res.render("refreshpassword", { msgForRefresh: "Don't leave blank." ,token:token});
  } else if ((password != repeatpassword)) {
    res.render("refreshpassword", { msgForRefresh: "Mismatch passwords.",token:token });
  } else if ((password.length<6)) {
    res.render("refreshpassword", { msgForRefresh: "The length of the pasword should be more than 6 character",token:token });
  } 
  else {
    const encryptedpass = utilities.encrypt(password);
    User.findOne({ token: token })
      .then((user) => {
        if (user == null||user.tokenused==1) {
          res.render("forgetpassword", {
            msgForForget: "Invalid token!!!"
          });
        } else {
          User.findOneAndUpdate({ token: token }, { password: encryptedpass,tokenused:1 })
            .then((user) => {
              res.render("refreshpassword", {
                msgForRefresh: "Your password is updated!!!",token:token
              });
            })
            .catch((err) => {
              logger.errorLog(err);;
            });
        }
      })
      .catch((err) => {
        logger.errorLog(err);
      });
  }
};

module.exports = {
  sendLoginPage,
  performLogin,
  performLogout,
  sendforgetPasswordPage,
  performForgetPassword,
  sendRefreshPasswordPage,
  performRefreshPassword,
};
