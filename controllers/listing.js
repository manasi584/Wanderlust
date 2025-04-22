const axios = require("axios");

const Listing = require("../models/listing");
const { listingSchema } = require("../schema");
const ExpressError = require("../utils/ExpressError");

const index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
};

const renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

const showListing = async (req, res, next) => {
  const id = req.params.id;
  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner");

  if (!listing) {
    req.flash("error", "Listing does not exist !");
    return res.redirect("/listings");
  } else res.render("listings/show.ejs", { listing });
};

const createListing = async (req, res) => {
  const x = listingSchema.validate(req.body);

  if (x.error) {
    throw new ExpressError(400, x.error);
  }
  const listing = new Listing(req.body.listing);
  listing.owner = req.user._id;
  await listing.save();

  // OpenCage Geocoding
  const apiKey = process.env.OPENCAGE_API_KEY;
  const address = listing.location;

  try {
    const geoResponse = await axios.get(
      "https://api.opencagedata.com/geocode/v1/json",
      {
        params: {
          q: address,
          key: apiKey,
        },
      }
    );

    const geoData = geoResponse.data;

    if (geoData.results.length > 0) {
      const { lat, lng } = geoData.results[0].geometry;
      listing.geometry = { type: "Point", coordinates: [lng, lat] };
      await listing.save();
      req.flash("success", "New listing created !");
      res.redirect("/listings");
    } else {
      req.flash("error", "Could not geocode the listing location.");
      res.redirect("/listings/new");
    }
  } catch (error) {
    console.error("Geocoding error:", error);
    req.flash("error", "Failed to fetch location data.");
    res.redirect("/listings");
  }
};

const renderEditForm = async (req, res) => {
  const currListing = await Listing.findById(req.params.id);
  if (!currListing) {
    req.flash("error", "Listing does not exist!");
    return res.redirect("/listings");
  }
  res.render("listings/edit.ejs", { listing: currListing });
};

const editForm = async (req, res) => {
  //change geocoding if location is edited
  await Listing.findByIdAndUpdate(req.params.id, { ...req.body.listing });
 

  req.flash("success", "Listing updated!");

  return res.redirect(`/listings/${req.params.id}`);
};
const deleteListing = async (req, res) => {
  await Listing.findByIdAndDelete(req.params.id);

  req.flash("success", "Listing deleted!");

  return res.redirect("/listings");
};



module.exports = {
  index,
  renderNewForm,
  showListing,
  createListing,
  renderEditForm,
  editForm,
  deleteListing,
 
};
