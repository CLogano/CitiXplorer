const express = require("express");
const router = express.Router();
require("dotenv").config();

const apiKey = process.env.GOOGLE_API_KEY;

router.get("/location", async (req, res) => {

    const latitude = req.query.lat;
    const longitude = req.query.long;
    
    try {

        const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`);
        res.json(response.data.results[0]);

    } catch (error) {
        console.error(error);
    }
    
});

router.get("/location-by-address", async (req, res) => {

    const { address } = req.query;

    try {
        const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`);
        const data = await response.json();
        const location = data.results[0].geometry.location;
        res.json(location);
    } catch (error) {
        console.error(error);
    }
});

module.exports = router;