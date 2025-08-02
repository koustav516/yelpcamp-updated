const User = require("../models/user");

module.exports.renderRegisterForm = (req, res) => {
    res.render("auth/register.ejs");
};

module.exports.registerUser = async (req, res) => {
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
};

module.exports.renderLoginForm = (req, res) => {
    res.render("auth/login.ejs");
};

module.exports.loginUser = (req, res) => {
    req.flash("success", "Welcome back!");
    const redirectUrl = res.locals.returnTo || "/campgrounds";
    delete req.session.returnTo;
    res.redirect(redirectUrl);
};

module.exports.logoutUser = (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash("success", "You have been logged out");
        res.redirect("/campgrounds");
    });
};
