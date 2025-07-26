const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const morgan = require("morgan");
const ExpressError = require("./utils/ExpressError");

const campgrounds = require("./routes/campgrounds");
const reviews = require("./routes/review");

const app = express();

const PORT = 3000;

mongoose
    .connect("mongodb://127.0.0.1:27017/yelp-camp")
    .then(() => console.log("Db Connected!"))
    .catch((err) => {
        console.log("Db Connectoion Error");
        console.log(err);
    });

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(morgan("tiny")); //logger

app.use("/campgrounds", campgrounds);
app.use("/campgrounds/:id/reviews", reviews);

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
