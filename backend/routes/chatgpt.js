const express = require("express");
const router = express.Router();
const { Configuration, OpenAIApi } = require("openai");
const jsonParser = require("body-parser").json();
require("dotenv").config();

const config = new Configuration({
    apiKey: process.env.OPEN_AI_API_KEY,
});

const openai = new OpenAIApi(config);

router.post("/", jsonParser, async (req, res) => {
    try {
        const { content } = req.body;
        console.log(content);
        const response = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: content}]
        });
        return res.status(200).json({
            success: true,
            data: response.data.choices[0].message.content
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            error: error.response
            ? error.response.data
            : "There was an issue on the server"
        });
    }
})

module.exports = router;