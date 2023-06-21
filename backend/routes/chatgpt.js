const express = require("express");
const router = express.Router();
const jsonParser = require("body-parser").json();

require("dotenv").config();
const { Configuration, OpenAIApi } = require("openai");

const config = new Configuration({
    apiKey: process.env.OPEN_AI_API_KEY,
});
const openai = new OpenAIApi(config);

router.post("/process", jsonParser, async (req, res) => {

    try {
        
        const { prompt } = req.body;

        const response = await openai.createCompletion({
            model: "ada:ft-personal-2023-06-11-20-27-52",
            prompt: prompt,
            max_tokens: 200
        });
        if (response.data) {
            res.json(response.data.choices[0]);
        }

    } catch (error) {
        console.error(error)
    }
});

router.post("/", jsonParser, async (req, res) => {
    try {
        
        const { content } = req.body;
        // console.log(content);
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
});

router.post("/refined", jsonParser, async (req, res) => {
    try {
        
        const { messages } = req.body;
        // console.log(messages);
        const response = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: messages
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
});

module.exports = router;