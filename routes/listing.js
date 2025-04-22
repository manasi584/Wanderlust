const express = require("express");

const wrapAsync = require("../utils/wrapAsync");
const { isLoggedIn, validateListing, isOwner } = require("../middleware");
const listingController = require("../controllers/listing");


const router = express.Router();



router
  .route("/")
  .get(wrapAsync(listingController.index))
  .post(
    isLoggedIn,
    validateListing,
    wrapAsync(listingController.createListing)
  );
 

//this route if written after the show route throws error as the router will then understand /new as an id
router.get("/new", isLoggedIn, listingController.renderNewForm);

router
  .route("/:id")
  .get(wrapAsync(listingController.showListing))
  .put(
    isLoggedIn,
    isOwner,
    validateListing,
    wrapAsync(listingController.editForm)
  )
  .delete(isLoggedIn, isOwner, wrapAsync(listingController.deleteListing));

router.get(
  "/:id/edit",
  isLoggedIn,
  wrapAsync(listingController.renderEditForm)
);

module.exports = router;
