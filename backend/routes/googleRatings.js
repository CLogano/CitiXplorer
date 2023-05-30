const express = require("express");
const { Client } = require("@googlemaps/google-maps-services-js");
const router = express.Router();

const mapsClient = new Client({});
const apiKey = process.env.GOOGLE_API_KEY;

router.get("/", async (req, res) => {

    const { destination } = req.query;

    try {
        const response = await mapsClient.findPlaceFromText({
            params: {
                input: destination,
                inputtype: "textquery",
                fields: ["place_id"],
                key: apiKey,
            },
            timeout: 1000,
          });
        
        if (response.data.candidates && response.data.candidates.length > 0) {

            const destinationId = response.data.candidates[0].place_id;

            const { data } = await mapsClient.placeDetails({
                params: {
                    place_id: destinationId,
                    fields: ["rating"],
                    key: apiKey,
                },
                timeout: 1000,
            });

            const rating = data.result.rating;
            res.json({ rating });
        } else {
            console.error("No candidates found for destination: " + destination);
            res.status(404).json({ error: "No candidates found for destination: " + destination });
        }

    } catch (error) {
        console.error(error);
    }
});

module.exports = router;