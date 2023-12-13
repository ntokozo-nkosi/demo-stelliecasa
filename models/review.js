const mongoose = require("mongoose")

// Schema
const reviewSchema = mongoose.Schema({
    body: String,
    rating: Number
})

// Collection
const Review = mongoose.model("Review", reviewSchema)

module.exports = { Review }