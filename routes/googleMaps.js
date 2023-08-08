const express = require("express");
require("dotenv").config();
const router = express.Router();
const apiKey = process.env.GOOGLE_API_KEY;
const { Client } = require("@googlemaps/google-maps-services-js");

const mapsClient = new Client({});

router.get("/search", async (req, res) => {

  const city = req.query.city;
  console.log("Searching in " + city)
  
  try {
    const response = await mapsClient.textSearch({
      params: {
        query: `historical attractions in ${city}`,
        key: apiKey,
      },
      timeout: 5000
    });

    const sortedResults = response.data.results.sort((a, b) => b.user_ratings_total - a.user_ratings_total);
    const top10Results = sortedResults.slice(0, 10);

    const promises = top10Results.map(async (result) => {
      const details = await mapsClient.placeDetails({
        params: {
          place_id: result.place_id,
          key: apiKey,
          fields: ["reviews", "website", "formatted_phone_number", "photos", "opening_hours"],
        },
      });

      const { photos, website, reviews, formatted_phone_number, opening_hours } = details.data.result;

      const imageUrls = [];
      if (photos) {
        for (const photo of photos) {
    
          const url = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photoreference=${photo.photo_reference}&key=${apiKey}`;
          imageUrls.push(url);
      
          if (imageUrls.length >= 5) {
            break;
          }
        }
      }

      return {
        ...result,
        website,
        formatted_phone_number,
        reviews,
        imageUrls,
        opening_hours
      };
    });

    const updatedResults = await Promise.all(promises);
    
    res.json(updatedResults);
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error(error);
    }
    res.status(500).json({ error: "An error occurred" });
  }
});

router.get("/images-city", async (req, res) => {

  const { city } = req.query;

  try {
    
    const response = await mapsClient.findPlaceFromText({
      params: {
        input: city,
        inputtype: "textquery",
        fields: ["place_id"],
        key: apiKey,
      },
      timeout: 5000,
    });

    if (response.data.candidates && response.data.candidates.length > 0) {

      const destinationId = response.data.candidates[0].place_id;

      const imageUrls = await getImages(mapsClient, destinationId);

      res.json({ imageUrls });

    } else {
      throw new Error("No candidates found for city: " + city);
    }

  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error(error);
    }
    res.status(500).json({ error: "An error occurred" });
  }
});

router.get("/location-by-address", async (req, res) => {

  const { address } = req.query;

  try {
      const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      if (!data.results || data.results.length === 0) {
          return res.status(404).json({ message: "No location found for the provided address." });
      }
      const location = data.results[0].geometry.location;
      res.json(location);
      
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error(error);
    }
    res.status(500).json({ error: "An error occurred" });
  }
});

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

    if (response.status === 200) {

      const images = response.data.result.photos;

      const imageUrls = [];
      if (images) {
        for (const image of images) {

          const url = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&minwidth=400&maxheight=500&photoreference=${image.photo_reference}&key=${apiKey}`;
          imageUrls.push(url);

          if (imageUrls.length >= 4) {
            break;
          }
        }
      } else {
        throw new Error("No images found for destinationId: " + destinationId);
      }

      return imageUrls;

    } else {
      throw new Error("Network response was not ok");
    }

  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error(error);
    }
  } 
}

module.exports = router;


