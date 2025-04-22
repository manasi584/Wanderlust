const express = require("express");
const passport = require("passport");

const wrapAsync = require("../utils/wrapAsync");
const { saveRedirectUrl } = require("../middleware");

const userController = require("../controllers/user");

const router = express.Router();

router
  .route("/signup")
  .get(userController.renderSignup)
  .post(wrapAsync(userController.userSignup));

router
  .route("/login")
  .get(userController.renderLogin)
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    wrapAsync(userController.userLogin)
  );

router.get("/logout", userController.userLogout);

module.exports = router;
