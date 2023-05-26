
export function generateChatPrompt(topic, location) {

    return "You are an expert in tourism. Please list 10 places to see as a tourist in " + 
    location + " with a topic of " + topic + ". Answer in the following format as a list:" + 
    "'Name: <Name of Place>\nDescription: <Description of Place>.'" + 
    "Do not include a new line before starting the next place in the list.";
}

