const express = require("express");
const { NlpManager } = require("node-nlp");
const nlpRouter = express.Router();
const path = require("path");

let manager;

async function loadNLPModel() {

    manager = new NlpManager({ languages: ['en'] });

    const modelPath = path.join(__dirname, "../models/nlp.json");
    await manager.load(modelPath);
  
    console.log("SUCCESS! Model loaded.");
  }

nlpRouter.post("/", async (req, res) => {

    const { textInput } = req.body;
    console.log("Prompt: " + textInput);

    try {
        const response = await manager.process("en", textInput);

        let intents = response.intents;
        let entities = response.entities;

        if (!intents) {
            intents = [];
            console.error('No intents found');
        }

        if (!entities) {
            entities = [];
            console.error('No entities found');
        }

        res.json({ intents, entities });

    } catch (error) {
        console.error(error);
    }  
});

module.exports = {
    loadNLPModel,
    nlpRouter,
};