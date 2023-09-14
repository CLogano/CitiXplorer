import React, { useState, useEffect, useCallback, useRef, Fragment, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { RectContext } from "../../../../contexts/RectContext";
import Modal from "../../../../UI/Modal";
import classes from "./LocationInput.module.css";
import CONSTANTS from "../../../../constants";

const LocationInput = (props) => {

    const [text, setText] = useState("");
    const [touchedOnce, setTouchedOnce] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const [isValid, setIsValid] = useState(null);
    const [showDropDown, setShowDropDown] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [citySuggestions, setCitySuggestions] = useState([]);
    const [tooltipVisible, setTooltipVisible] = useState(false);
    const [pop, setPop] = useState(false);
    const tooltipTimerRef = useRef(null);
    const locationRef = useRef(null);
    const componentRef = useRef(null);
    const message = "Please select a valid city.";
    const navigate = useNavigate();
    const pathLocation = useLocation();

    const { refs } = useContext(RectContext);
    const locationInputRef = refs.locationInput;

    useEffect(() => {
        if (locationInputRef.current === null) {
            locationInputRef.current = componentRef.current;
        }
    }, [componentRef]);

    const onChangeHandler = useCallback((event) => {

        if (!touchedOnce) {
            setTouchedOnce(true);
        }

        setText(event.target.value);
        setIsValid(false);

    }, [touchedOnce]);


    const onBlurHandler = useCallback(() => {

        if (!touchedOnce) {
            setTouchedOnce(true);
        }
        setIsFocused(false);
        if (tooltipTimerRef.current) {
            clearTimeout(tooltipTimerRef.current);
            setTooltipVisible(false);
        }
        tooltipTimerRef.current = setTimeout(() => {
            setTooltipVisible(true);
        }, 500);
        
    }, [touchedOnce]);

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


    const { location } = props;

    const parisInfoTutorial = {name: "Paris, France", population: 2138551, geonameId: 2988507, lat: 48.85341, lng: 2.3488}
    const { tutorialPage } = props;
    useEffect(() => {
        if (tutorialPage >= 1) {
            location(parisInfoTutorial);
        } else {
            location("");
        }
    }, [tutorialPage])

    const { city } = props;
    useEffect(() => {

        if (city) {
            
            setText(city.name);
            setIsValid(true);
            setPop(true);

            const timer = setTimeout(() => {
                setPop(false);
            }, 200);
            return () => {
                clearTimeout(timer);
            };  
        }     

    }, [city]);


    const onClickHandler = useCallback(() => {

        if (!touchedOnce) {
            setTouchedOnce(true);
        }
        setIsFocused(true);
    }, [touchedOnce]);

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

    const selectTermDropdown = (item) => (event) => {

        event.preventDefault();
        location(item);

        if (pathLocation.pathname !== "/") {
            navigate("/");
        }
    };

    let isInvalid = !isValid && touchedOnce && !isFocused;

    const fetchCities = async (textInput) => {

        try {
            const response = await fetch(CONSTANTS.apiURL + `/geonames/location?text=${textInput}`);

            if (!response.ok) {
                setShowErrorModal(true);
            }
            const data = await response.json();

            console.log(data);
            
            if(data && data.length > 0) {
                setCitySuggestions(data);
                setShowDropDown(true);
            } else {
                setShowDropDown(false);
            }

        } catch (error) {
            if (process.env.NODE_ENV !== "production") {
                console.error(error);
            }
        }
    };

    const deleteInput = () => {
        setText("");
        setIsFocused(true);
        setIsValid(false);
        locationRef.current.focus();
    };

    const closeModalHandler = () => {
        setShowErrorModal(false);
    }

    return (
        <Fragment>
            {showErrorModal &&
                <Modal onClose={closeModalHandler}>
                    <div className={classes["error-outer-container"]}>
                        <div className={classes["error-inner-container"]}>
                            <span className={`material-symbols-rounded ${classes["error-icon"]}`}>sentiment_dissatisfied</span>
                            <h1 className={classes.oops}>Oops!</h1>
                        </div>
                        <p className={classes["error-message"]}>An unexpected error occurred. Please try again later.</p>
                    </div>
                </Modal>
            }
            <div className={`${classes["search-container"]} ${pop && classes.pop}`} ref={componentRef} style={props.style ? props.style : null}>
                <div className={`${classes["search-inner"]}
                ${isInvalid && classes.invalid}`}>
                    <span className={`material-icons ${classes["location-icon"]}`}>location_on</span>
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
                    <span className={`material-symbols-rounded ${classes["close-icon"]}`} onClick={deleteInput}>close</span>
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
                                    onMouseDown={selectTermDropdown(item)}
                                >{item.name}
                                </div>
                            ))}
                    </div>
                )}
                {props.children ? props.children : null}
            </div>
        </Fragment>

    );
};

export default LocationInput;