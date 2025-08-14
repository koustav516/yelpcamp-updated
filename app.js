if (process.env.NODE_ENV != "production") {
    require("dotenv").config();
}

const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const morgan = require("morgan");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const MongoStore = require("connect-mongo")(session);

const ExpressError = require("./utils/ExpressError");
const sanitizeV5 = require("./utils/mongoSanitizeV5");

const campgroundsRoutes = require("./routes/campgrounds");
const reviewsRoutes = require("./routes/review");
const authRoutes = require("./routes/auth");

const User = require("./models/user");

const app = express();

const PORT = process.env.PORT || 3000;
const dbUrl = process.env.DB_URL || "mongodb://127.0.0.1:27017/yelp-camp";
const secret = process.env.SECRET || "thisshouldbeasecret";

mongoose
    .connect(dbUrl)
    .then(() => console.log("Db Connected!"))
    .catch((err) => {
        console.log("Db Connectoion Error");
        console.log(err);
    });

app.engine("ejs", ejsMate);
app.set("query parser", "extended");
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(morgan("tiny")); //logger
app.use(express.static(path.join(__dirname, "public")));
app.use(sanitizeV5({ replaceWith: "_" }));

const store = new MongoStore({
    url: dbUrl,
    secret,
    touchAfter: 24 * 60 * 60, // 1 day timing
});

store.on("error", function (e) {
    console.log("Session store error: ", e);
});

const sessionConfig = {
    store,
    name: "yelpcampsession",
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7, //1 week timing
        maxAge: 1000 * 60 * 60 * 24 * 7,
    },
};
app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser()); //To get user into the session
passport.deserializeUser(User.deserializeUser()); //To get user out of the session

app.use((req, res, next) => {
    console.log(req.query);
    res.locals.currentUser = req.user;
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});

app.use("/", authRoutes);
app.use("/campgrounds", campgroundsRoutes);
app.use("/campgrounds/:id/reviews", reviewsRoutes);

app.get("/", (req, res) => {
    res.render("home");
});

app.all(/(.*)/, (req, res, next) => {
    next(new ExpressError("Page not found!", 404));
});

app.use((err, req, res, next) => {
    const { status = 500 } = err;
    if (!err.message) err.message = "Something went wrong!";
    res.status(status).render("error", { err });
});

app.listen(PORT, () => {
    console.log(`Server Up at ${PORT}`);
});
