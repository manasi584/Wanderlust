const {listingSchema,reviewSchema}=require("./schema")
const Listing=require("./models/listing")
const ExpressError=require("./utils/ExpressError")
const Review=require("./models/review")


const isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "you must be logged-in first");
    return res.redirect("/login");
  }
  next();
};

const saveRedirectUrl=(req,res,next)=>{
  if(req.session.redirectUrl){
    res.locals.redirectUrl=req.session.redirectUrl;
  }
  next();
}

const validateListing = (req, res, next) => {
  //for server side validation
  const { error } = listingSchema.validate(req.body);
  if (error) {
    throw new ExpressError(400, error);
  }
  next();
};

const validateReview=(req,res,next)=>{ //for server side validation 
  const {error}=reviewSchema.validate(req.body);
  if(error){
    throw new ExpressError(400,error);
  }
  next();

}

const defineLocals = (req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.user = req.user;
  next();
};

const errorMiddleware = (err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong!" } = err;

  res.status(statusCode).render("error.ejs", { message });
};


const isOwner= async (req,res,next)=>{
  const listing=await Listing.findById(req.params.id); 
  if (!listing.owner.equals(res.locals.user._id)) {
    req.flash("error", "you don't have permission");
    return res.redirect(`/listings/${req.params.id}`);
  }

  next();
}
const isReviewAuthor= async (req,res,next)=>{
  const { id, reviewId } = req.params;
  const review=await Review.findById(reviewId);
  if (!review.author.equals(res.locals.user._id)) {
    req.flash("error", "you don't have permission");
    return res.redirect(`/listings/${id}`);
  }

  next();
}

module.exports = {
  isLoggedIn,
  validateListing, validateReview,
  defineLocals,
  errorMiddleware,
  saveRedirectUrl,
  isOwner , isReviewAuthor,
};
