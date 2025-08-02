const express = require("express");
const router = express.Router({ mergeParams: true });
const catchAsyncError = require("../utils/catchAsyncError");
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware");
const { createReview, deleteReview } = require("../controllers/reviews");

router.post("/", isLoggedIn, validateReview, catchAsyncError(createReview));

router.delete(
    "/:reviewId",
    isLoggedIn,
    isReviewAuthor,
    catchAsyncError(deleteReview)
);

module.exports = router;
