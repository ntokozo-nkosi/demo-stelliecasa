const mongoose = require("mongoose")

// Schema
const accommodationSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type:String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    image: {
        type: String,
        default: "https://source.unsplash.com/random/?apartment"
    },
    reviews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review"
    }]
})

// Model / Collection
const accommodation = mongoose.model("accommodation", accommodationSchema)

module.exports = { accommodation }

