const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const morgan = require("morgan");
const Joi = require("joi");
const Campground = require("./models/campground");
const catchAsyncError = require("./utils/catchAsyncError");
const ExpressError = require("./utils/ExpressError");

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

app.get("/", (req, res) => {
    res.render("home");
});

app.get(
    "/campgrounds",
    catchAsyncError(async (req, res) => {
        const campgrounds = await Campground.find({});
        res.render("campgrounds/index", { campgrounds });
    })
);

app.get("/campgrounds/new", (req, res) => {
    res.render("campgrounds/new");
});

app.post(
    "/campgrounds",
    catchAsyncError(async (req, res, next) => {
        const campgroundSchema = Joi.object({
            campground: Joi.object({
                name: Joi.string().required(),
                price: Joi.number().required().min(0),
                description: Joi.string().required(),
                image: Joi.string().required(),
                location: Joi.string().required(),
            }).required(),
        });
        const { error } = campgroundSchema.validate(req.body);
        if (error) {
            const msg = error.details.map((el) => el.message).join(",");
            throw new ExpressError(msg, 400);
        }
        const campground = new Campground(req.body.campground);
        await campground.save();
        res.redirect(`/campgrounds/${campground._id}`);
    })
);

app.get(
    "/campgrounds/:id",
    catchAsyncError(async (req, res) => {
        const { id } = req.params;
        const campground = await Campground.findById(id);
        res.render("campgrounds/show", { campground });
    })
);

app.get(
    "/campgrounds/:id/edit",
    catchAsyncError(async (req, res) => {
        const { id } = req.params;
        const campground = await Campground.findById(id);
        res.render("campgrounds/edit", { campground });
    })
);

app.put(
    "/campgrounds/:id",
    catchAsyncError(async (req, res) => {
        const { id } = req.params;
        const campground = await Campground.findByIdAndUpdate(id, {
            ...req.body.campground,
        });
        res.redirect(`/campgrounds/${campground._id}`);
    })
);

app.delete(
    "/campgrounds/:id",
    catchAsyncError(async (req, res) => {
        const { id } = req.params;
        await Campground.findByIdAndDelete(id);
        res.redirect("/campgrounds");
    })
);

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
