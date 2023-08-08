const express = require('express');
const router = express.Router();
require("dotenv").config();

const geoUsername = process.env.GEONAMES_USERNAME;

router.get("/location", async (req, res) => {

    try {
        
        const text = req.query.text;
        const response = await fetch(`http://api.geonames.org/searchJSON?name_startsWith=${text}&cities=cities1000&username=${geoUsername}&maxRows=10`);
        
        if (response.status === 200) {

            const data = await response.json();
            const modifiedData = data.geonames.map(formatCityData);

            res.json(modifiedData);

        } else {
            if (response.status === 429) {
                return res.status(429).json({ error: "Rate limit exceeded" });
            } else if (response.status === 503) {
                return res.status(503).json({ error: "Service is temporarily unavailable" });
            } else {
                return res.status(response.status).json({ error: "Unexpected error occurred" });
            }
        }       

    } catch (error) {
        if (process.env.NODE_ENV !== "production") {
            console.error(error);
        }
        res.status(500).json({ error: "An error occurred" });
    }

});

router.get("/cities-in-view", async (req, res) => {
    try {
        const { lat, lng } = req.query;
        const response = await fetch(`http://api.geonames.org/findNearbyPlaceNameJSON?lat=${lat}&lng=${lng}&cities=cities1000&radius=5&username=${geoUsername}&maxRows=50`);
        const data = await response.json();
        if (data.message && data.message.includes("exceeded")) {
            return res.status(429).json({ error: "Rate limit exceeded" });
        }
        res.json(data.geonames.map(formatCityData));

    } catch (error) {
        if (process.env.NODE_ENV !== "production") {
            console.error(error);
        }
        res.status(500).json({ error: "An error occurred" });
    }
});

const formatCityData = (city) => {

    if (city.fcode.startsWith("PPL")) {
        let location;
        if (city.countryName === "United States") {
            location = `${city.name}, ${city.adminCode1}, ${city.countryName}`;
        } else {
            location = `${city.name}, ${city.countryName}`;
        }

        return {
            name: location,
            population: city.population,
            geonameId: city.geonameId,
            lat: Number(city.lat),
            lng: Number(city.lng)
        };
    }
};

module.exports = router;