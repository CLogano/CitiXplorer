const express = require("express");
require("dotenv").config();
const router = express.Router();
const apiKey = process.env.GOOGLE_API_KEY;
const { Client } = require("@googlemaps/google-maps-services-js");
// const turf = require("@turf/turf");

const mapsClient = new Client({});

router.get("/data", async (req, res) => {

  const { destination, city } = req.query;

  try {
    
    const response = await getDestination(mapsClient, destination, city);

    if (response && response.data && response.data.candidates.length > 0) {

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

  const { destination, city } = req.query;

  try {
    
    const response = await getDestination(mapsClient, destination, city);

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


router.get("/city-name", async (req, res) => {

  const latitude = req.query.lat;
  const longitude = req.query.lng;
  
  try {

    const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`);
    const data = await response.json();

    let cityName = null;
    for (let i = 0; i < data.results.length; i++) {
      if (data.results[i].types.includes("locality")) {
        cityName = data.results[i].address_components[0].long_name;
        break;
      }
    }
    console.log(cityName);
    res.json(cityName);

  } catch (error) {
    console.error(error);
  }
  
});

// router.get("/city-geometry", async (req, res) => {

//   const { city } = req.query;

//   try {
//       const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(city)}&key=${apiKey}`);
//       const data = await response.json();
//       if (!data.results || data.results.length === 0) {
//           return res.status(404).json({ message: "No location found for the provided address." });
//       }
//       const geometry = data.results[0].geometry.location;
//       res.json(geometry);
      
//   } catch (error) {
//       console.error(error);
//   }
// });


router.get("/location-by-address", async (req, res) => {

  const { address } = req.query;
  // const cityBoundaries = turf.polygon(boundaries);

  try {
      const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`);
      const data = await response.json();
      if (!data.results || data.results.length === 0) {
          return res.status(404).json({ message: "No location found for the provided address." });
      }
      const location = data.results[0].geometry.location;
      res.json(location);

      // const locationPoint = turf.point([location.lng, location.lat]);
      // if (turf.booleanPointInPolygon(locationPoint, cityBoundaries)) {
      //   res.json(location);
      // } else {
      //   res.status(400).json({ message: "The provided address is not within the desired city." });
      // }
      
  } catch (error) {
      console.error(error);
  }
});

router.get("/city-alias", async (req, res) => {

  const { address } = req.query;
  console.log(address)

  try {
    const canonicalCity = await getCanonicalCityName(address);

    if (canonicalCity) {
      res.json(canonicalCity);
    } else {
      console.log({ message: `No alias found for "${address}"` })
      res.status(404).json({ message: `No alias found for "${address}"` });
    }
  } catch (error) {
    console.error(error);
  }
});

async function getCanonicalCityName(cityAlias) {
  const response = await mapsClient.geocode({
    params: {
      address: cityAlias,
      key: apiKey
    }
  });

  const results = response.data.results;
  if (results && results.length > 0) {
    // Extract the 'locality' component, which should be the city
    const cityComponent = results[0].address_components.find(component =>
      component.types.includes("locality") || component.types.includes("sublocality")
    );
    if (cityComponent) {
      return cityComponent.long_name;
    }

    const adminAreaOneComponent = results[0].address_components.find(component =>
      component.types.includes("administrative_area_level_1")
    );
    if (adminAreaOneComponent) {
      return adminAreaOneComponent.long_name;
    }

    // const adminAreaTwoComponent = results[0].address_components.find(component =>
    //   component.types.includes("administrative_area_level_2")
    // );
    // if (adminAreaTwoComponent) {
    //   return adminAreaTwoComponent.long_name;
    // }
  }

  return null;
}

async function getDestination(mapsClient, destination, city) {

  try {

    const canonicalCity = await getCanonicalCityName(city);
    const response = await mapsClient.findPlaceFromText({
      params: {
        input: destination + ", " + canonicalCity,
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
        fields: ["photos", "name", "formatted_address"],
        key: apiKey,
      },
      timeout: 1000,
    });

    const images = response.data.result.photos;
  
    const imageUrls = [];
    if (images) {
      for (const image of images) {
  
        const url = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photoreference=${image.photo_reference}&key=${apiKey}`;
        imageUrls.push(url);
    
        if (imageUrls.length >= 5) {
          break;
        }
      }
    } else {
      console.error("No photos found for destinationId: " + destinationId);
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
        fields: ["name", "rating", "user_ratings_total", "formatted_address", "formatted_phone_number", "opening_hours", "website", "photos", "business_status", "reviews"],
        key: apiKey,
      },
      timeout: 1000,
    });

    const { name, rating, user_ratings_total, formatted_address, formatted_phone_number, opening_hours, website, photos, business_status, reviews } = response.data.result;

    const imageUrls = [];
    if (photos) {
      for (const photo of photos) {
  
        const url = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photoreference=${photo.photo_reference}&key=${apiKey}`;
        imageUrls.push(url);
    
        if (imageUrls.length >= 5) {
          break;
        }
      }
    } else {
      console.error("No photos found for destinationId: " + destinationId);
    }

    const data = {
      name,
      rating,
      user_ratings_total,
      formatted_address,
      formatted_phone_number,
      opening_hours,
      website,
      imageUrls,
      business_status,
      reviews
    };

    return data;

  } catch (error) {
    console.error(error);
  }
}