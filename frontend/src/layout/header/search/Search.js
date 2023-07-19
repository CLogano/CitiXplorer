import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
//import PromptInput from "./inputs/PromptInput";
import LocationInput from "./inputs/LocationInput";
import classes from "./Search.module.css";

const Search = (props) => {

    const [formIsValid, setFormIsValid] = useState(false);
    const [locationValidity, setLocationValidity] = useState(null);
    const navigate = useNavigate();
    const pathLocation = useLocation();
    // const [city, setCity] = useState(null);
    // const [prompt, setPrompt] = useState(null);

    const { city } = props;
    useEffect(() => {
        const identifier = setTimeout(() => {
            //setFormIsValid(location && prompt);
            setFormIsValid(city && locationValidity);
        }, 500);
            
        return () => {
            clearTimeout(identifier);
        };
    //}, [location, prompt]);
    }, [city, locationValidity]);

     const onSubmitHandler = (event) => {
        event.preventDefault();
        if (formIsValid) {
            // props.search(prompt, location);
            props.searchHandler(true);
            
            if (pathLocation.pathname !== "/") {
                navigate("/");
            }
        }
    };

    const locationHandler = (location) => {
        
        // setCity(location.name);
        props.cityHandler(location);
        
    };

    const locationValidityHandler = (isValid) => {
        setLocationValidity(isValid);
    };

    // const promptHandler = (prompt) => {
    //     setPrompt(prompt);
    // };

    return (
        <form className={classes.form} onSubmit={onSubmitHandler} >
            <LocationInput
                id="Location"
                type="text"
                placeholder="New York City, NY, United States"
                location={locationHandler}
                locationValidity={locationValidityHandler}
                city={city}
            />
            {/* <PromptInput
                id="Prompt"
                type="text"
                placeholder="Please recommend me 10 Italian restaurants in the $20-$30 price range."
                prompt={promptHandler}
            /> */}
            <button type="submit" className={classes["search-button"]}>
                <span class={`material-symbols-rounded ${classes["search"]} ${classes["search-icon"]}`}>search</span>
            </button>
        </form>
    );
};

export default Search;