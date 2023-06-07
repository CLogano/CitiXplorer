import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import classes from "./Home.module.css";
import CONSTANTS from "../../constants";
import Search from "./Search";
import LoadingRing from "../../UI/LoadingRing";
import { generateChatPrompt } from "../../prompts";
import { generateChatPrompt2 } from "../../prompts";

const Home = () => {

    const [chatList, setChatList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const parsePlaces = (str, location) => {

        const places = [];
        const lines = str.split("\n");
        const filteredLines = lines.filter(line => line.includes("Name: ") || line.includes("Description: "));

        for (let i = 0; i < filteredLines.length; i += 2) {
            
            const name = filteredLines[i].split(": ")[1];
            const description = filteredLines[i + 1].split(": ")[1];
            const place = { name: name, description: description, location: location};
            places.push(place);
        }
        return places;
    }

    const getCurrentLocation = () => {

        return new Promise((resolve, reject) => {

            if ("geolocation" in navigator) {
                navigator.geolocation.getCurrentPosition(async position => {
    
                    const latitude = position.coords.latitude;
                    const longitude = position.coords.longitude;
    
                    try {
                        const response = await fetch(CONSTANTS.apiURL + `/geolocation/location?lat=${latitude}&long=${longitude}`);
                        const data = await response.json();
                        resolve(data.formatted_address);
    
                    } catch (error) {
                        reject(error);
                    }
                })
            } else {
                reject("This browser does not support Geolocation.");
            }
        })
        
    }

    const searchHandler = async (location, topic) => {

        setIsLoading(true);

        //Gather user's current location if selected
        if (location === "Your Location") {
            location = await getCurrentLocation();
        }

        console.log("Location: " + location);
        
        //Generate prompt for ChatGPT API
        const textInput = generateChatPrompt2(topic, location);

        const textInputJSON = {
            content: textInput
        };
        
        try {

            const response = await fetch(CONSTANTS.apiURL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(textInputJSON),
            });

            const result = await response.json();
            console.log(result.data);
            const resultArray = parsePlaces(result.data, location);
            console.log(resultArray);

            setChatList(resultArray);

        } catch (error) {
            console.log("Error occurred while calling API:", error);
        }
    };

    useEffect(() => {
        //console.log(chatList);
        if (chatList.length > 0) {
            setIsLoading(false);
            navigate("/destinations", { state: chatList });
        }
    }, [chatList, navigate]);

    return (
        <div className={classes.dashboard}>
            <Search search={searchHandler}/>
            {isLoading && <LoadingRing />}
        </div>
    )
};

export default Home;