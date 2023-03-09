const User = require("../models/User");
const sendProfilePage = (req, res) => {
  res.render("profile", { user: req.user });
};

const updateProfile = (req, res) => {
  const { username, currentpassword, newpassword, newpasswordrepeat, photo } =
    req.body;
  if (
    username == "" &&
    currentpassword == "" &&
    newpassword == "" &&
    newpasswordrepeat == "" &&
    photo == ""
  ) {
    res.send("Do not leave blank");
  } else if (username != "") {
    User.findOneAndUpdate({ email: req.user.email }, { username: username })
      .then((user) => {
        req.user.username=username;
        res.send("Username is updated.");
      })
      .catch((err) => {
        logger.errorLog(err);
      });
  }
  else{
    res.send("Err");
  }
};
module.exports = { sendProfilePage, updateProfile };
