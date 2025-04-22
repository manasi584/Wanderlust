const express = require("express");


const wrapAsync = require("../utils/wrapAsync");
const { validateReview, isLoggedIn , isReviewAuthor } = require("../middleware");
const reviewController=require("../controllers/review")

const router = express.Router({ mergeParams: true }); //important

router.post(
  "/",
  validateReview,
  isLoggedIn,
  wrapAsync(reviewController.createReview)
);

router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(reviewController.deleteReview)
);

module.exports = router;
