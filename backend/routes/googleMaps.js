const express = require("express");
require("dotenv").config();
const router = express.Router();
const apiKey = process.env.GOOGLE_API_KEY;
const { Client } = require("@googlemaps/google-maps-services-js");

const mapsClient = new Client({});

router.get("/data", async (req, res) => {

  const { destination } = req.query;

  try {
    
    const response = await getDestination(mapsClient, destination);

    if (response.data.candidates && response.data.candidates.length > 0) {

      const destinationId = response.data.candidates[0].place_id;

      const data = await getData(mapsClient, destinationId);
      res.json({ data });

    } else {
      console.error("No candidates found for destination: " + destination);
      res.status(404).json({ error: "No candidates found for destination: " + destination });
    }

  } catch (error) {
    console.error(error);
  }
});


router.get("/images", async (req, res) => {

  const { destination } = req.query;

  try {
    
    const response = await getDestination(mapsClient, destination);

    if (response.data.candidates && response.data.candidates.length > 0) {

      const destinationId = response.data.candidates[0].place_id;

      const imageUrls = await getImages(mapsClient, destinationId);

      res.json({ imageUrls });

    } else {
      console.error("No candidates found for destination: " + destination);
      res.status(404).json({ error: "No candidates found for destination: " + destination });
    }

  } catch (error) {
    console.error(error);
  }
});

router.get("/apiKey", async (req, res) => {
  res.json({ apiKey: process.env.GOOGLE_API_KEY});
});

module.exports = router;


async function getDestination(mapsClient, destination) {

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

    return response;
    
  } catch (error) {
    console.error("No candidates found for destination: " + destination);
  }
}


async function getImages(mapsClient, destinationId) {

  try {

    const response = await mapsClient.placeDetails({
      params: {
        place_id: destinationId,
        fields: ["photos"],
        key: apiKey,
      },
      timeout: 1000,
    });
  
    const images = response.data.result.photos;
  
    const imageUrls = [];
    for (const image of images) {
  
      const url = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photoreference=${image.photo_reference}&key=${apiKey}`;
      imageUrls.push(url);
  
      if (imageUrls.length >= 5) {
        break;
      }
    }
    return imageUrls;

  } catch (error) {
    console.error(error);
  } 
}

async function getData(mapsClient, destinationId) {

  try {

    const response  = await mapsClient.placeDetails({
      params: {
        place_id: destinationId,
        fields: ["rating", "user_ratings_total", "formatted_address", "formatted_phone_number", "opening_hours", "website"],
        key: apiKey,
      },
      timeout: 1000,
    });

    const { rating, user_ratings_total, formatted_address, formatted_phone_number, opening_hours, website } = response.data.result;

    const data = {
      rating,
      user_ratings_total,
      formatted_address,
      formatted_phone_number,
      opening_hours,
      website
    };

    return data;

  } catch (error) {
    console.error(error);
  }
}