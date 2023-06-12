import React, { useState, useEffect, useCallback } from "react";
import classes from "./LocationInput.module.css";
import CONSTANTS from "../../constants";

const LocationInput = (props) => {

    const [text, setText] = useState("");
    const [touchedOnce, setTouchedOnce] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const [isValid, setIsValid] = useState(null);
    const [showDropDown, setShowDropDown] = useState(false);
    const [citySuggestions, setCitySuggestions] = useState([]);

    const onChangeHandler = useCallback((event) => {

        if (!touchedOnce) {
            setTouchedOnce(true);
        }

        setText(event.target.value);
        setIsValid(false);

    }, [touchedOnce]);


    const onBlurHandler = useCallback(() => {
        setIsFocused(false);
    }, []);

    useEffect(() => {

        if (!isValid && isFocused && text !== "") {

            setShowDropDown(true);

            const identifier = setTimeout(() => {
                fetchCities(text);
            }, 300);
                
            return () => {
                clearTimeout(identifier);
            };

        } else {
            setShowDropDown(false);
        }

    }, [isValid, isFocused, text]);

    const onClickHandler = useCallback(() => {

        if (!touchedOnce) {
            setTouchedOnce(true);
        }
        setIsFocused(true);
    }, [touchedOnce]);

    const selectTerm = (item) => (event) => {

        event.preventDefault();

        setText(item.name)
        setIsValid(true);

        props.location(item.name);
    }; 

    const deleteInput = () => {
        setText("");
    };

    let isInvalid = !isValid && touchedOnce;

const fetchCities = async (textInput) => {

    try {
        const response = await fetch(CONSTANTS.apiURL + `/geonames/location?text=${textInput}`);
        const data = await response.json();
        setCitySuggestions(data);

    } catch (error) {
        console.error(error);
    }
}

return (
    <div className={classes["search-container"]}>
        <div className={`${classes["search-inner"]}
                ${isInvalid === true ? classes.invalid : ""
            }`}>
            <span class={`material-icons ${classes["location-icon"]}`}>location_on</span>
            <input
                type={props.type}
                id={props.id}
                value={text}
                onClick={onClickHandler}
                onChange={onChangeHandler}
                onBlur={onBlurHandler}
                placeholder={props.placeholder}
                autoComplete="off"
            />
            <span class={`material-symbols-rounded ${classes["close-mark"]}`} onClick={deleteInput}>close</span>
        </div>
        {showDropDown && (
            <div className={classes.dropdown}>
                {citySuggestions
                    .slice(0, 10)
                    .map(item => (
                        <div
                            className={classes["dropdown-row"]}
                            key={item.geonameId}
                            onMouseDown={selectTerm(item)}
                        >{item.name}
                        </div>
                    ))}
            </div>
        )}
    </div>
    );
};

export default LocationInput;