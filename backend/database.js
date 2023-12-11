const mongoose = require("mongoose");
require("dotenv").config();

async function connect() {

    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to MongoDB!");
    } catch (error) {
        console.error(error);
    }
}

connect();

module.exports = mongoose;