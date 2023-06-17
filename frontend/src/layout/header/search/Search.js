import React, { useEffect, useState } from "react";
import PromptInput from "./inputs/PromptInput";
import LocationInput from "./inputs/LocationInput";
import classes from "./Search.module.css";

//placeholder
// const locationTerms = [
//     {content: "Your Location"},
//     {content: "Paris"},
//     {content: "London"},
//     {content: "Porto"},
//     {content: "Atlanta"},
//     {content: "Amsterdam"},
//     {content: "Metz"},
//     {content: "Brussels"},
//     {content: "Munich"},
//     {content: "Florence"},
//     {content: "Rome"},
//     {content: "Athens"},
//     {content: "New York City"},
// ];

const Search = (props) => {

    const [formIsValid, setFormIsValid] = useState(false);
    const [location, setLocation] = useState(null);
    const [prompt, setPrompt] = useState(null);

    useEffect(() => {
        const identifier = setTimeout(() => {
            setFormIsValid(location && prompt);
        }, 500);
            
        return () => {
            clearTimeout(identifier);
        };
    }, [location, prompt]);

     const onSubmitHandler = (event) => {
        event.preventDefault();
        if (formIsValid) {
            props.search(prompt, location);
        }
    };

    const locationHandler = (location) => {
        setLocation(location); 
    };

    const promptHandler = (prompt) => {
        setPrompt(prompt);
    };

    return (
        <form className={classes.form} onSubmit={onSubmitHandler} >
            <LocationInput
                id="Location"
                type="text"
                placeholder="New York City, NY, United States"
                location={locationHandler}
            />
            <PromptInput
                id="Prompt"
                type="text"
                placeholder="Please recommend me 10 Italian restaurants in the $20-$30 price range."
                prompt={promptHandler}
            />
            <button type="submit" className={classes["search-button"]}>
                <span class={`material-symbols-rounded ${classes["search"]} ${classes["search-icon"]}`}>search</span>
            </button>
        </form>
    );
};

export default Search;