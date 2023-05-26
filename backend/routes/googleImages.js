const express = require("express");
require("dotenv").config();
const router = express.Router();
const apiKey = process.env.GOOGLE_API_KEY;
const { Client } = require("@googlemaps/google-maps-services-js");

const mapsClient = new Client({});

router.get("/", async (req, res) => {

  const { destination } = req.query;

  try {
    const placeResponse = await mapsClient.findPlaceFromText({
      params: {
        input: destination,
        inputtype: "textquery",
        fields: ["place_id"],
        key: apiKey,
      },
      timeout: 1000,
    });

    const destinationId = placeResponse.data.candidates[0].place_id;

    const imageResponse = await mapsClient.placeDetails({
      params: {
        place_id: destinationId,
        fields: ["photos"],
        key: apiKey,
      },
      timeout: 1000,
    });

    const images = imageResponse.data.result.photos;

    const imageUrls = [];
    for (const image of images) {

      const url = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photoreference=${image.photo_reference}&key=${apiKey}`;
      imageUrls.push(url);

      if (imageUrls.length >= 5) {
        break;
      }
    }

    res.json({ imageUrls });

  } catch (error) {
    console.error(error);
  }
});

module.exports = router;