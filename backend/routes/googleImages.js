const express = require("express");
require("dotenv").config();
const router = express.Router();
const GoogleImages = require("google-images");
const { imageHash } = require("image-hash");

//Initializing GoogleImages generator
const apiKey = process.env.GOOGLE_API_KEY;
const cxId = process.env.CSE_ID;
const imageGenerator = new GoogleImages(cxId, apiKey);

//GET http request at "/googleImages" sent from frontend
router.get("/", async (req, res) => {

  const { destination } = req.query;

  try {

    //Fetch images of destination from Google Images API and extract their urls
    const images = await imageGenerator.search(destination + "exterior");
    const imageUrls = images.map(image => image.url);

    //Initalize hashset and valid urls array
    const seenHashes = new Set();
    const validUrls = [];

    //Checks to see if each image is unique and adds to validUrls array
    for (const url of imageUrls) {
      try {
        const hashPromise = new Promise((resolve, reject) => {
          imageHash(url, 16, true, (error, hash) => {
            if (error) {
              reject(error);
            } else {
              resolve(hash);
            }
          });
        });

        
        const hash = await hashPromise;
        if (!seenHashes.has(hash)) {
          seenHashes.add(hash);
          validUrls.push(url);
        }
        if (validUrls.length >= 5) {
          break;
        } 
      } catch (error) {
        console.error(error);
        // If the fetch request fails, move on to the next image URL
        continue;
      }
    }
    //Send the image urls to frontend
    res.json(validUrls);

  } catch (error) {
    console.error(error);
    res.status(500).send("Error getting image");
  }

});

module.exports = router;