const express = require('express');
const router = express.Router();
require("dotenv").config();

const geoUsername = process.env.GEONAMES_USERNAME;

router.get("/location", async (req, res) => {

    try {
        
        const text = req.query.text;
        const response = await fetch(`http://api.geonames.org/searchJSON?name_startsWith=${text}&cities=cities1000&username=${geoUsername}&maxRows=10`);
        const data = await response.json();
        const modifiedData = data.geonames.map(city => {
            
            if (city.fcode.startsWith('PPL')) {
                let location;
                if (city.countryName === "United States") {
                    location = `${city.name}, ${city.adminCode1}, ${city.countryName}`;
                } else {
                    location = `${city.name}, ${city.countryName}`;
                }
        
                return {
                    name: location,
                    population: city.population,
                    geonameId: city.geonameId
                };
            }
        });

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

        const modifiedData = data.geonames.map(city => {
            
            if (city.fcode.startsWith('PPL')) {
                let location;
                if (city.countryName === "United States") {
                    location = `${city.name}, ${city.adminCode1}, ${city.countryName}`;
                } else {
                    location = `${city.name}, ${city.countryName}`;
                }
        
                return {
                    name: location,
                    population: city.population,
                    geonameId: city.geonameId
                };
            }
        });   

        if (modifiedData.length > 0) {
            res.json(modifiedData[0]);
        } else {
            res.json([]);
        }
        

    } catch (error) {
        console.error(error);
    }
});

module.exports = router;