
export function generateChatPrompt(location) {

    return "As an expert in tourism and recommending historical attractions to visit, your purpose is to provide up to 10 historical attractions for the user to visit based on the city given. Each attraction should have historical significance and is very popular. If you cannot think of 10 attractions that you deem worthy, then list as many as you can find. Your answers must be limitied to within that city ONLY. The description of the place should be welcoming, concise, and yet informative, and a maximum of two sentences long. " + 
    "Your answers should be in the following format: 'Name: <Name of Place>\nDescription: <Description of Place>.' Here is the inputted city you must answer for: '" + location + "'.";
}

export const generateRefinedChatPrompt = "Please provide me with five more historical attractions. Please answer in the same format as before.";


// export function generateRefinedChatPrompt(prompt) {

//     return "The answer you provided me is insufficient. Here are more details: '" + prompt + "'. Please retry the search with this information.";
// }

export function generateDestinationShortPrompt(destinationName, location) {

    return "As an expert in tourism and recommending historical attractions to visit, your job will be to provide a concise, easy-to-read, and tourist-friendly description of a tourist destination I will ask you about. I will give you the name of the destination and its location. Your description should be 1-2 sentences long." + 
    " Here is the tourist destination of interest: " + destinationName + ". Also, here is its location: " + location + ".";
}

export function generateDestinationDetailPrompt(destinationName, location) {

    return "As an expert in history, and recommending historical attractions to visit, your job will be to provide a very detailed description of a historical attraction I will ask you about. I will give you the name of the destination and its location. Your description should be 2-3 paragraphs long, with relevant information about the destination. Each paragraph should be about 3-4 sentences long. Examples of information to include are its history, the local area surrounding the destination, and reasons for visiting." + 
    " Here is the tourist destination of interest: " + destinationName + ". Also, here is its location: " + location + ".";
}

export function generateCityHistoryPrompt(location) {

    return "As an expert in history, your job will be to provide a four paragraph response which entails the history of a location I will ask you about. Answer in a neutral perspective and make sure to include relevant dates and events pertaining to the history. Make sure your response is informative, yet easy to read. Each paragraph should be between 4 - 6 sentences. " +
    "Here is the location of interest: " + location + "."
}


// export function detectPromptIntents(prompt) {

//     return "You are TravelGPT, an expert in tourism and recommending destinations for people to visit. " + 
//     "We have a request with the following details: '" + prompt + "' " +
//     "Please seperate this request into possible intents that the user is asking for related to finding destinations to visit. " +
//     "Here is a list of the possible intents:\n" + 
//     "1. Destination Rating (must contain a number) \n" +
//     "2. Destination Price\n" +
//     "3. Destination Topic\n" +
//     "If the request does not fall under any of these intents, please return the phrase 'No intent found' " +
//     "Otherwise, your answer must be in the format '1. {Intent 1} 2. {Intent 2} etc.' Your answer may contain more than one intent or only have one intent. " +
//     "Give an explanation for each intent."
// }

