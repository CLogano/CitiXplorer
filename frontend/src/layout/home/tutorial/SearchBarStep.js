import React, { useState, useEffect } from "react";
import classes from "./SearchBarStep.module.css";
import LocationInput from "../../header/search/inputs/LocationInput";
import Arrow from "../../../UI/Arrow";
import Card from "../../../UI/Card";

const SearchBarStep = (props) => {

    const { rect } = props;

    if (rect) {

        const cloneStyle = {
            position: "fixed",
            left: `${rect.left}px`,
            top: `${rect.top}px`,
            width: `${rect.width}px`,
            height: `${rect.height}px`,
            margin: 0,
            pointerEvents: "none",
            zIndex: 10001,
        };

        const arrowStyle = {
            top: "4rem",
            left: "50%",
            transform: "translateX(-50%)"
        };

        return (
            <div className={classes.container}>
                <LocationInput 
                    id="Location"
                    type="text"
                    placeholder="Paris, France"
                    location={() => {}}
                    locationValidity={() => {}}
                    city=""
                    style={cloneStyle}
                > 
                    <Arrow style={arrowStyle} />
                </LocationInput>
                <Card className={classes["message-container"]}>
                    <p className={classes.message}>To begin, enter the <b className={classes["highlight-text"]}>name</b> of a city within the search bar.</p>
                    <p className={classes.message}>Use the <b className={classes["highlight-text"]}>dropdown menu</b> to select one of the options.</p>
                </Card>
            </div>
        );   
    }
    
    return null;
    
};

export default SearchBarStep;