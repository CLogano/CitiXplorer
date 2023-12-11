const mongoose = require("mongoose");

const reviewSchema = mongoose.Schema({
    author_name: String,
    author_url: String,
    language: String,
    original_language: String,
    profile_photo_url: String,
    rating: Number,
    relative_time_description: String,
    text: String,
    time: Number,
    translated: Boolean
});

const citySchema = new mongoose.Schema({
    name: String,
    attractions: [
        {
            name: String,
            rating: Number,
            totalRatings: Number,
            website: String,
            hours: [String],
            address: String,
            phoneNumber: String,
            images: [String],
            reviews: [reviewSchema],
            geometry: {
                lat: Number,
                lng: Number
            }
        }
    ],
    description: {
        paragraphs: [String],
        images: [String]
    }
});


module.exports = mongoose.model("City", citySchema);