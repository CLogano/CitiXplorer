import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import classes from "./Home.module.css";
import CONSTANTS from "../../constants";
import Search from "./Search";
import LoadingRing from "../../UI/LoadingRing";

const Home = () => {

    const [chatList, setChatList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const parsePlaces = (str, location) => {
        const places = [];
        const lines = str.split("\n");
        for (let i = 0; i < lines.length; i += 3) {
            const name = lines[i].split(": ")[1];
            const description = lines[i + 1].split(": ")[1];
            const place = { name: name, description: description, location: location};
            places.push(place);
        }
        return places;
    }

    const searchHandler = async (location, topic) => {

        setIsLoading(true);
        
        const textInput = "You are an expert in tourism. Please list 10 places to see as a tourist in " + 
        location + " with a topic of " + topic + ". Answer in the following format as a list:" + 
        "'Name: <Name of Place>\nDescription: <Description of Place>.'" + 
        "Do not include a new line before starting the next place in the list.";

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
            const resultArray = parsePlaces(result.data, location);
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
            <h1 className={classes.text}>Welcome! <br/> Please enter information about your destination:</h1>
            <Search search={searchHandler}/>
            {isLoading && <LoadingRing />}
        </div>
    )
};

export default Home;