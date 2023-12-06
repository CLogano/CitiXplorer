
export function generateDestinationShortPrompt(destinationName, location) {

    return "As an expert in tourism and recommending historical attractions to visit, your job will be to provide a concise, easy-to-read, and tourist-friendly description of a tourist destination I will ask you about. I will give you the name of the destination and its location. Your description should be 1-2 sentences long." + 
    " Here is the tourist destination of interest: " + destinationName + ". Also, here is its location: " + location + ".";
}

export function generateDestinationDetailPrompt(destinationName, location) {

    return "As an expert in history, and recommending historical attractions to visit, your job will be to provide a very detailed description of a historical attraction I will ask you about. I will give you the name of the destination and its location. Your description should be about 4 paragraphs long, with relevant information about the destination. Each paragraph should be about 3-4 sentences long. Examples of information to include are its history, the local area surrounding the destination, and reasons for visiting." + 
    " Here is the tourist destination of interest: " + destinationName + ". Also, here is its location: " + location + ".";
}

export function generateCityHistoryPrompt(location) {

    return "As an expert in history, your job will be to provide a THREE paragraph response which entails the history of a location I will ask you about. Answer in a neutral perspective and make sure to include relevant dates and events pertaining to the history. Make sure your response is informative, yet easy to read. Each paragraph should be between 3 - 5 sentences. " +
    "Here is the location of interest: " + location + ". Remember, do not make your response longer than 3 paragraphs."
}