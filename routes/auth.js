const express = require("express");
const router = express.Router();
const User = require("../models/user");
const catchAsync = require("../utils/catchAsyncError");
const passport = require("passport");
const { storeReturnTo } = require("../middleware");

//register routes
router.get("/register", (req, res) => {
    res.render("auth/register.ejs");
});

router.post(
    "/register",
    catchAsync(async (req, res) => {
        try {
            const { username, email, password } = req.body;
            const user = new User({ username, email });
            const registeredUser = await User.register(user, password);
            req.login(registeredUser, (err) => {
                if (err) return next(err);
                req.flash("success", "Welcome to yelpcamp!");
                res.redirect("/campgrounds");
            });
        } catch (e) {
            req.flash("error", "Username already exists");
            res.redirect("/register");
        }
    })
);

//login routes
router.get("/login", (req, res) => {
    res.render("auth/login.ejs");
});

router.post(
    "/login",
    storeReturnTo,
    passport.authenticate("local", {
        failureFlash: true,
        failureRedirect: "/login",
    }),
    (req, res) => {
        req.flash("success", "Welcome back!");
        const redirectUrl = res.locals.returnTo || "/campgrounds";
        delete req.session.returnTo;
        res.redirect(redirectUrl);
    }
);

//logout route
router.get("/logout", (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash("success", "You have been logged out");
        res.redirect("/campgrounds");
    });
});

module.exports = router;
