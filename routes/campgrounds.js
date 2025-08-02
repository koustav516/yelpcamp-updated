const express = require("express");
const router = express.Router();
const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({ storage });
const catchAsyncError = require("../utils/catchAsyncError");
const { isLoggedIn, isAuthor, validateCampground } = require("../middleware");
const {
    index,
    renderNewCampgroundForm,
    createNewCampground,
    showCampground,
    renderEditCampgroundForm,
    editCampground,
    deleteCampground,
} = require("../controllers/campgrounds");

router
    .route("/")
    .get(catchAsyncError(index))
    .post(
        isLoggedIn,
        validateCampground,
        upload.array("image"),
        catchAsyncError(createNewCampground)
    );

router.get("/new", isLoggedIn, renderNewCampgroundForm);

router
    .route("/:id")
    .get(catchAsyncError(showCampground))
    .put(
        isLoggedIn,
        isAuthor,
        validateCampground,
        upload.array("image"),
        catchAsyncError(editCampground)
    )
    .delete(isLoggedIn, isAuthor, catchAsyncError(deleteCampground));

router.get(
    "/:id/edit",
    isLoggedIn,
    isAuthor,
    catchAsyncError(renderEditCampgroundForm)
);

module.exports = router;
