
export function generateChatPrompt(topic, location) {

    return "You are an expert in tourism and recommending places for people to visit. Please list 10 places to see as a tourist in " + 
    location + " with a topic of " + topic + ". Answer in the following format as a list:" + 
    "'Name: <Name of Place>\nDescription: <Description of Place>.'" + 
    "Do not include a new line before starting the next place in the list.";
}

export function generateChatPrompt2(prompt, location) {

    return "You are TravelGPT, an expert in tourism and recommending places for people to visit. " +
    "Your purpose will be to answer a prompt given by the user for their specified location. " +
    "Please give the most accurate results as if you were their tour guide and/or friend. " +
    "Provide the name of the place and a concise, yet informative description of the place. " + 
    "Your answer MUST be in the following format as a list: " + 
    "'Name: <Name of Place>\nDescription: <Description of Place>.' " + 
    "Here is the prompt: '" + prompt + "'. Here is the location for the given prompt: '" + location + "'.";
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

