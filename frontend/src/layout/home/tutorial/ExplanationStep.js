import React from "react";
import classes from "./ExplanationStep.module.css";
import Card from "../../../UI/Card";
import logo from "../../../pictures/logo.png";

const ExplanationStep = () => {

    return (
        <Card className={classes["message-container"]}>
            <p className={classes.message}>
            <b className={classes["highlight-text"]}>Planning a trip</b> to a new city soon?
            </p>
            <div className={classes["inner-container"]}>
                <img className={classes.logo} src={logo} alt="Logo" />
                <p className={classes["message-2"]}>
                    is an application that recommends <b className={classes["highlight-text"]}>historical attractions</b> to visit in various <b className={classes["highlight-text"]}>cities</b> around the world.
                </p>
            </div>
            <p className={classes.message}>
                Each entry is created using data from <b className={classes["highlight-text"]}>Google Maps</b> and enhanced with descriptions created by <b className={classes["highlight-text"]}>ChatGPT.</b>
            </p>
        </Card>
    );

}

export default ExplanationStep;