const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsyncError");
const passport = require("passport");
const { storeReturnTo } = require("../middleware");
const {
    renderRegisterForm,
    registerUser,
    renderLoginForm,
    loginUser,
    logoutUser,
} = require("../controllers/auth");

//register routes
router
    .route("/register")
    .get(renderRegisterForm)
    .post(catchAsync(registerUser));

//login routes
router
    .route("/login")
    .get(renderLoginForm)
    .post(
        storeReturnTo,
        passport.authenticate("local", {
            failureFlash: true,
            failureRedirect: "/login",
        }),
        loginUser
    );

//logout route
router.get("/logout", logoutUser);

module.exports = router;
