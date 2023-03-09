const User = require("../models/User");
const utilities = require("./utilities");
const passportlocal = require("passport");
const LocalStrategy = require("passport-local");

const auth = (user, password, cb) => {
  let encryptedpass = utilities.encrypt(password);
  
  User.findOne({ $or: [{ email: user }, { username: user }] }).then((user) => {
    if (user == null) {
      return cb(null, false, { message: "Invalid email or password" });
    } else {
      if (user.verified == 0) {
        return cb(null, false, {
          message:
            "Please approve your email from the link in your inbox",
        });
      } else if (user.password == encryptedpass) {
        return cb(null, user);
      }
      else{
        return cb(null, false, { message: "Invalid email or password" });
      }
    }
  });
};

passportlocal.use(new LocalStrategy(auth));

passportlocal.serializeUser(function (user, cb) {
  process.nextTick(function () {
    cb(null, { email: user.email, username: user.username,photo:user.photo });
  });
});

passportlocal.deserializeUser(function (user, cb) {
  process.nextTick(function () {
    return cb(null, user);
  });
});

const checkauth = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
};

module.exports = { auth, checkauth, passportlocal };
