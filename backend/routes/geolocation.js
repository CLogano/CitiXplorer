const express = require("express");
const router = express.Router();
const axios = require("axios");
require("dotenv").config();

const apiKey = process.env.GOOGLE_API_KEY;

router.get("/location", async (req, res) => {

    const latitude = req.query.lat;
    const longitude = req.query.long;
    
    try {

        const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`);
        res.json(response.data.results[0]);

    } catch (error) {
        console.log(error);
    }
    
});

module.exports = router;