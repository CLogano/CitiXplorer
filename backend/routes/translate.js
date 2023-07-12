const express = require("express");
require("dotenv").config();
const router = express.Router();
const path = require("path");
const keyFilePath = path.join(__dirname, '..', '..', process.env.GOOGLE_APPLICATION_CREDENTIALS);
const { Translate } = require("@google-cloud/translate").v2;

const translate = new Translate({ keyFilePath });

router.get("/to-english", async (req, res) => {

    const { text } = req.query;
    // console.log(text);
    

    try {
    
        let [translations] = await translate.translate(text, "en");
        translations = Array.isArray(translations) ? translations : [translations];
    
        console.log("text: " + text + " trans", translations);
        res.json(translations);
    
      } catch (error) {
        console.error(error);
      }
});

module.exports = router;