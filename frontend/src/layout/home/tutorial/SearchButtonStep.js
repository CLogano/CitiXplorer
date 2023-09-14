import React from "react";
import classes from "./SearchButtonStep.module.css";
import SearchButton from "../../header/search/SearchButton";
import Card from "../../../UI/Card";
import Arrow from "../../../UI/Arrow";

const SearchButtonStep = (props) => {

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
            <div>
                <SearchButton style={cloneStyle}>
                    <Arrow style={arrowStyle} />
                </SearchButton>
                <Card className={classes["message-container"]}>
                    <p className={classes.message}>
                        After inputting your desired city, press the 
                        <b className={classes["highlight-text"]}> search button </b>
                        to discover <b className={classes["highlight-text"]}>historical attractions</b> in that city!
                    </p>
                    <p className={classes.message}>For example, try searching in <b className={classes["highlight-text"]}>Paris, France.</b></p>
                </Card>
            </div>
        );   
    }
    
    return null;
}

export default SearchButtonStep;