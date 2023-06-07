const express = require("express");
require("dotenv").config();
const router = express.Router();
const apiKey = process.env.GOOGLE_API_KEY;
const { Client } = require("@googlemaps/google-maps-services-js");

const mapsClient = new Client({});

router.get("/", async (req, res) => {

  const { destination } = req.query;

  try {
    
    const response = await getDestination(mapsClient, destination);

    if (response.data.candidates && response.data.candidates.length > 0) {

      const destinationId = response.data.candidates[0].place_id;

      const imageUrls = await getImages(mapsClient, destinationId);
      const rating = await getRating(mapsClient, destinationId);

      const content = {
        imageUrls,
        rating
      };

      res.json({ content });

    } else {
      console.error("No candidates found for destination: " + destination);
      res.status(404).json({ error: "No candidates found for destination: " + destination });
    }

  } catch (error) {
    console.error(error);
  }
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
    return imageUrls;

  } catch (error) {
    console.error(error);
  } 
}

async function getRating(mapsClient, destinationId) {

  try {

    const { data } = await mapsClient.placeDetails({
      params: {
        place_id: destinationId,
        fields: ["rating"],
        key: apiKey,
      },
      timeout: 1000,
    });
  
    return data.result.rating;

  } catch (error) {
    console.error(error);
  }
}