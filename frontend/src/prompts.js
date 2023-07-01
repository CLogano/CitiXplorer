
export function generateChatPrompt(location) {

    return "As TravelGPT, an expert in tourism and recommending historical attractions to visit, your purpose is to provide up to 10 historical attractions for the user to visit based on the city given. Each attraction should have historical significance and popular among tourists. If you cannot think of 10 attractions that you deem worthy, then list as many as you can find. Please provide accurate and up to date recommendations. Your answers must be limitied to within that city ONLY. Your answers should be in the following format: 'Name: <Name of Place>\nDescription: <Description of Place>.' "+ 
    "Here is the inputted city: '" + location + "'.";
}

export function generateRefinedChatPrompt(prompt) {

    return "The answer you provided me is insufficient. Here are more details: '" + prompt + "'. Please retry the search with this information.";
}


export function detectPromptIntents(prompt) {

    return "You are TravelGPT, an expert in tourism and recommending destinations for people to visit. " + 
    "We have a request with the following details: '" + prompt + "' " +
    "Please seperate this request into possible intents that the user is asking for related to finding destinations to visit. " +
    "Here is a list of the possible intents:\n" + 
    "1. Destination Rating (must contain a number) \n" +
    "2. Destination Price\n" +
    "3. Destination Topic\n" +
    "If the request does not fall under any of these intents, please return the phrase 'No intent found' " +
    "Otherwise, your answer must be in the format '1. {Intent 1} 2. {Intent 2} etc.' Your answer may contain more than one intent or only have one intent. " +
    "Give an explanation for each intent."
}

