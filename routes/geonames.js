const express = require('express');
const router = express.Router();
require("dotenv").config();

const geoUsername = process.env.GEONAMES_USERNAME;

router.get("/location", async (req, res) => {

    try {
        
        const text = req.query.text;
        const response = await fetch(`http://api.geonames.org/searchJSON?name_startsWith=${text}&cities=cities1000&username=${geoUsername}&maxRows=10`);
        const data = await response.json();
        const modifiedData = data.geonames.map(formatCityData);

        res.json(modifiedData);

    } catch (error) {
        console.error(error);
    }

});

router.get("/nearest-city", async (req, res) => {

    try {
        
        const { lat, lng } = req.query;
        const response = await fetch(`http://api.geonames.org/findNearbyPlaceNameJSON?lat=${lat}&lng=${lng}&cities=cities1000&username=${geoUsername}&maxRows=10`);
        const data = await response.json();

        const modifiedData = data.geonames.map(formatCityData);

        if (modifiedData.length > 0) {
            res.json(modifiedData[0]);
        } else {
            res.json([]);
        }
        

    } catch (error) {
        console.error(error);
    }
});

router.get("/cities-in-view", async (req, res) => {
    try {
        const { lat, lng } = req.query;
        const response = await fetch(`http://api.geonames.org/findNearbyPlaceNameJSON?lat=${lat}&lng=${lng}&cities=cities1000&radius=5&username=${geoUsername}&maxRows=50`);
        const data = await response.json();
        res.json(data.geonames.map(formatCityData));
    } catch (error) {
        console.error(error);
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