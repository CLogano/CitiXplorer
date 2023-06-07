const express = require('express');
const axios = require('axios');
const router = express.Router();
require("dotenv").config();

const geoUsername = process.env.GEONAMES_USERNAME;

router.get("/location", async (req, res) => {

    try {
        
        const text = req.query.text;
        const response = await axios.get(`http://api.geonames.org/searchJSON?name_startsWith=${text}&cities=cities1000&username=${geoUsername}&maxRows=10`);
        const modifiedData = response.data.geonames.map(city => {
            
            let location;
            if (city.countryName === "United States") {
                location = `${city.name}, ${city.adminCode1}, ${city.countryName}`;
            } else {
                location = `${city.name}, ${city.countryName}`;
            }

            return {
                name: location,
                geonameId: city.geonameId
            }
        });

        res.json(modifiedData);

    } catch (error) {
        console.error(error);
    }
});

module.exports = router;