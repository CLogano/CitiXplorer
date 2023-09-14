import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import LocationInput from "./inputs/LocationInput";
import SearchButton from "./SearchButton";
import classes from "./Search.module.css";

const Search = (props) => {

    const [formIsValid, setFormIsValid] = useState(false);
    const [locationValidity, setLocationValidity] = useState(null);
    const navigate = useNavigate();
    const pathLocation = useLocation();

    const { city } = props;
    useEffect(() => {
        const identifier = setTimeout(() => {
            setFormIsValid(city && locationValidity);
        }, 500);
            
        return () => {
            clearTimeout(identifier);
        };

    }, [city, locationValidity]);

     const onSubmitHandler = (event) => {
        event.preventDefault();
        if (formIsValid) {
            props.searchHandler(true);
            
            if (pathLocation.pathname !== "/") {
                navigate("/");
            }
        }
    };

    const locationHandler = (location) => {
        props.cityHandler(location);     
    };

    const locationValidityHandler = (isValid) => {
        setLocationValidity(isValid);
    };

    return (
        <form className={classes.form} onSubmit={onSubmitHandler} >
            <LocationInput
                id="Location"
                type="text"
                placeholder="Paris, France"
                location={locationHandler}
                locationValidity={locationValidityHandler}
                city={city}
                tutorialPage={props.tutorialPage}
            />
            <SearchButton />
        </form>
    );
};

export default Search;