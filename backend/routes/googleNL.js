const express = require("express");
const router = express.Router();
const { LanguageServiceClient } = require("@google-cloud/language");
const path = require('path');
const keyFilePath = path.join(__dirname, '..', '..', '..', process.env.GOOGLE_APPLICATION_CREDENTIALS);

router.post("/", async (req, res) => {

    try {

        const client = new LanguageServiceClient( { keyFilename: keyFilePath });

        const { prompt } = req.body;
        
        const document = {
            content: prompt,
            type: "PLAIN_TEXT",
        };

        const [response] = await client.analyzeEntities({ document });
        const entities = response.entities;

        const data = entities.map(entity => {
            return {
                name: entity.name,
                type: entity.type,
                salience: entity.salience
            }
        });

        res.json(data);

    } catch (error) {
        console.error(error);
    }

});

module.exports = router;