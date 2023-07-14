import React, { useState, useEffect, useCallback, useRef } from "react";
import classes from "./LocationInput.module.css";
import CONSTANTS from "../../../../constants";

const LocationInput = (props) => {

    const [text, setText] = useState("");
    const [touchedOnce, setTouchedOnce] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const [isValid, setIsValid] = useState(null);
    const [showDropDown, setShowDropDown] = useState(false);
    const [citySuggestions, setCitySuggestions] = useState([]);
    const [tooltipVisible, setTooltipVisible] = useState(false);
    const tooltipTimerRef = useRef(null);
    const locationRef = useRef(null);
    const message = "Please select from the list of places.";


    const onChangeHandler = useCallback((event) => {

        if (!touchedOnce) {
            setTouchedOnce(true);
        }

        setText(event.target.value);
        setIsValid(false);

    }, [touchedOnce]);


    const onBlurHandler = useCallback(() => {
        setIsFocused(false);
        if (tooltipTimerRef.current) {
            clearTimeout(tooltipTimerRef.current);
        }
        tooltipTimerRef.current = setTimeout(() => {
            setTooltipVisible(true);
        }, 500);
        
    }, []);

    const onFocusHandler = useCallback(() => {
        setIsFocused(true);
        clearTimeout(tooltipTimerRef.current);
      }, []);

    useEffect(() => {

        if (!isValid && isFocused && text !== "") {

            const identifier = setTimeout(async () => {
                await fetchCities(text);
            }, 250);  

            return () => {
                clearTimeout(identifier);
            };                 

        } else {
            setShowDropDown(false);
        }

    }, [isValid, isFocused, text]);

    const { locationValidity } = props;
    useEffect(() => {
        locationValidity(isValid);
    }, [isValid, locationValidity]);


    const onClickHandler = useCallback(() => {

        if (!touchedOnce) {
            setTouchedOnce(true);
        }
        setIsFocused(true);
    }, [touchedOnce]);

    // useEffect(() => {
    //     console.log("touched once: " + touchedOnce);
    //     console.log("is focused : " + isFocused);
    //     console.log("is valid: " + isValid);
    //     console.log("show dropdown: " + showDropDown);
    //     console.log("");
        
    // }, [isFocused, isValid, showDropDown, touchedOnce]);

    useEffect(() => {

        if (tooltipVisible) {
            const timeoutId = setTimeout(() => {
                setTooltipVisible(false);
              }, 5000);
              return () => {
                clearTimeout(timeoutId);
              };
        }
    }, [tooltipVisible]);

    const selectTerm = (item) => (event) => {

        event.preventDefault();

        setText(item.name)
        setIsValid(true);

        
        props.location({name: item.name, population: item.population});
       
    };

    let isInvalid = !isValid && touchedOnce && !isFocused;

    const fetchCities = async (textInput) => {

        try {
            const response = await fetch(CONSTANTS.apiURL + `/geonames/location?text=${textInput}`);
            const data = await response.json();
            
            if(data && data.length > 0) {
                setCitySuggestions(data);
                setShowDropDown(true);
            } else {
                setShowDropDown(false);
            }

        } catch (error) {
            console.error(error);
        }
    };

    const deleteInput = () => {
        setText("");
        setIsFocused(true);
        setIsValid(false);
        locationRef.current.focus();
    };

    return (
        <div className={classes["search-container"]}>
            <div className={`${classes["search-inner"]}
                ${isInvalid && classes.invalid}`}>
                <span class={`material-icons ${classes["location-icon"]}`}>location_on</span>
                <input
                    type={props.type}
                    id={props.id}
                    value={text}
                    onClick={onClickHandler}
                    onChange={onChangeHandler}
                    onBlur={onBlurHandler}
                    onFocus={onFocusHandler}
                    placeholder={props.placeholder}
                    autoComplete="off"
                    ref={locationRef}
                />
                <span class={`material-symbols-rounded ${classes["close-icon"]}`} onClick={deleteInput}>close</span>
                {isInvalid && !showDropDown && (
                    <div className={`${classes.tooltip} ${tooltipVisible ? classes.visible : ""}`}>{message}</div>
                )}
            </div>
            {!isInvalid && showDropDown && (
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