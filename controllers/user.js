const User = require("../models/user");

module.exports.renderSignup = (req, res) => {
  res.render("users/signup.ejs");
};

module.exports.renderLogin = (req, res) => {
  res.render("users/login.ejs");
};

module.exports.userSignup = async (req, res) => {
  try {
    const { username, password, email } = req.body;

    const newUser = new User({
      username,
      email,
    });

    const registeredUser = await User.register(newUser, password);
    req.login(registeredUser, (err, next) => {
      if (err) {
        return next(err);
      } else {
        req.flash("success", "Welcome to Wanderlust!");

        return res.redirect("/listings");
      }
    });
  } catch (e) {
    req.flash("error", e.message);
    return res.redirect("/signup");
  }
};

module.exports.userLogin = async (req, res) => {
  req.flash("success", "Welcome back to wandelust , you are logged in !");
  if (!res.locals.redirectUrl) return res.redirect("/listings");
  return res.redirect(res.locals.redirectUrl);
};

module.exports.userLogout = (req, res) => {
  req.logout((err, next) => {
    if (err) {
      return next(err);
    } else {
      req.flash("success", "You are logged out now");
      res.redirect("/listings");
    }
  });
};
