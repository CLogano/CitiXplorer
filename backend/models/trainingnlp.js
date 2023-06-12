const { NlpManager } = require("node-nlp");
const { ratingSynonyms, priceSynonyms, foodSynonyms } = require("./synonyms");

async function trainNLPModel() {

    const nlpManager = new NlpManager({ languages: ["en"] });

    nlpManager.addNamedEntityText("rating", "stars", ['en'], ratingSynonyms);
    nlpManager.addNamedEntityText("price", "price", ['en'], priceSynonyms);
    nlpManager.addNamedEntityText("food", "food", ['en'], foodSynonyms);

    //Rating Utterances
    nlpManager.addDocument("en", `in the 4-5 rating range`, "destination.rating");
    nlpManager.addDocument("en", `in the 3.5-5.0 star range`, "destination.rating");
    nlpManager.addDocument("en", `in the rating range of one to five stars`, "destination.rating");
    nlpManager.addDocument("en", `rating of 5.0`, "destination.rating");
    nlpManager.addDocument("en", `5 starred`, "destination.rating");

    //Price Utterances
    nlpManager.addDocument("en", `in the $20 - $30 price range`, "destination.price");
    nlpManager.addDocument("en", `in the twenty to thirty dollar range`, "destination.price");
    nlpManager.addDocument("en", `at least $40.00`, "destination.price");
    nlpManager.addDocument("en", `at least 18 dollars`, "destination.price");
    nlpManager.addDocument("en", `at minimum $20`, "destination.price");
    nlpManager.addDocument("en", `at most $25`, "destination.price");
    nlpManager.addDocument("en", `at most fifteen dollars`, "destination.price");
    nlpManager.addDocument("en", `at maximum $10`, "destination.price");
    nlpManager.addDocument("en", `around $30`, "destination.price");
    nlpManager.addDocument("en", `around ten dollars`, "destination.price");

    //Food Utterances
    nlpManager.addDocument("en", "Recommend me some restaurants", "destination.topic.food");
    nlpManager.addDocument("en", "I want to eat food", "destination.topic.food");
    nlpManager.addDocument("en", "Where can I eat Italian cuisine?", "destination.topic.food");
    nlpManager.addDocument("en", "What are the best pizzerias", "destination.topic.food");
    nlpManager.addDocument("en", "Suggest me some burger places", "destination.topic.food");
    nlpManager.addDocument("en", "Find me a coffee shop nearby", "destination.topic.food");
    nlpManager.addDocument("en", "Find me a fine dining restaurant for a special occasion", "destination.topic.food");

    //Unknown Utterances

    try {

        await nlpManager.train();
        await nlpManager.save("./nlp.json");
        console.log("SUCCESS! Model trained and saved.");

    } catch (error) {
        console.error(error);
    }
}

trainNLPModel();