import CONSTANTS from "../../../constants";
import { generateChatPrompt, generateRefinedChatPrompt } from "../../../prompts";

export const getGPTResponse = async (city, chatList, setChatList, messages, setMessages, setIsLoading, setDataFetched) => {

    setIsLoading(true);

    //Gather user's current location if selected
    // if (city === "Your Location") {
    //     city = await getCurrentLocation();
    // }

    console.log("City: " + city.name);
    //console.log("Prompt: " + prompt);





    // const textInput1 = detectPromptIntents(prompt);
    // const textInputJSON1 = {
    //         content: textInput
    // };

    // const promptJSON = {
    //     prompt: prompt
    // };

    // try {

    //     const response = await fetch(CONSTANTS.apiURL + "/googleNL", {
    //         method: "POST",
    //         headers: {
    //             "Content-Type": "application/json",
    //         },
    //         body: JSON.stringify(promptJSON),
    //     });

    //     const result = await response.json();
    //     console.log(result);

    // } catch (error) {
    //     console.log("Error occurred while calling API:", error);
    // }

    // try {

    //     const response = await fetch(CONSTANTS.apiURL + "/gpt/process", {
    //         method: "POST",
    //         headers: {
    //             "Content-Type": "application/json",
    //         },
    //         body: JSON.stringify(promptJSON),
    //     });

    //     const result = await response.json();
    //     console.log(result);

    // } catch (error) {
    //     console.log("Error occurred while calling API:", error);
    // }


    //Generate prompt for ChatGPT API
    const textInput = generateChatPrompt(city.name);

    const textInputJSON = {
        content: textInput
    };

    let result = {};
    let numTries = 0;
    while (!result.data && !chatList && numTries < 5) {

        try {

            const response = await fetch(CONSTANTS.apiURL + "/gpt", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(textInputJSON),
            });

            result = await response.json();
            console.log(result.data);

            // if (result.data.includes("I'm sorry") || result.data.includes("Apologies") || result.data.includes("sorry") || result.data.includes("Unfortunately")) {
            //     setChatList("N/A");
            // }

            const updatedMessages = [
                ...messages,
                { role: "user", content: textInput },
                { role: "assistant", content: result.data }
            ];
            setMessages(updatedMessages);
        
            const resultArray = parsePlaces(result.data, city.name);
            console.log(resultArray);
            if (resultArray.length > 0) {
                setChatList(resultArray);
            }

            setDataFetched(false);

        } catch (error) {
            console.log("Error occurred while calling API:", error);
        }
        numTries++;
    }
};

export const getRefinedGPTResponse = async (city, messages, setMessages) => {

    const textInput = generateRefinedChatPrompt;
    let updatedMessages = [
        ...messages,
        { role: "user", content: textInput },
    ];

    const messagesJSON = {
        messages: updatedMessages
    };

    try {

        const response = await fetch(CONSTANTS.apiURL + "/gpt/refined", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(messagesJSON),
        });

        const result = await response.json();
        console.log(result.data);

        updatedMessages = [
            ...messages,
            { role: "assistant", content: result.data }
        ];
        setMessages(updatedMessages);

        const resultArray = parsePlaces(result.data, city.name);

        return resultArray;

    } catch (error) {
        console.log("Error occurred while calling API:", error);
    }
}

// const getCurrentLocation = () => {

//     return new Promise((resolve, reject) => {

//         if ("geolocation" in navigator) {
//             navigator.geolocation.getCurrentPosition(async position => {

//                 const latitude = position.coords.latitude;
//                 const longitude = position.coords.longitude;

//                 try {
//                     const response = await fetch(CONSTANTS.apiURL + `/googleMaps/location?lat=${latitude}&long=${longitude}`);
//                     const data = await response.json();
//                     resolve(data.formatted_address);

//                 } catch (error) {
//                     reject(error);
//                 }
//             })
//         } else {
//             reject("This browser does not support Geolocation.");
//         }
//     })  
// };

const parsePlaces = (str, location) => {

    const places = [];
    const lines = str.split("\n");
    const filteredLines = lines.filter(line => line.includes("Name: ") || line.includes("Description: "));

    for (let i = 0; i < filteredLines.length; i += 2) {
        
        const name = filteredLines[i].includes("Name:") ? filteredLines[i].split(": ")[1] : null;
        const description = filteredLines[i + 1].includes("Description:") ? filteredLines[i + 1].split(": ")[1] : null;
        if (!name || !description) {
            break;
        }
        const place = { name: name, description: description, location: location};
        places.push(place);
    }
    return places;
};