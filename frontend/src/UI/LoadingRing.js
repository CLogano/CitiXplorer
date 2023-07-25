import React from "react";
import classes from "./LoadingRing.module.css";


const LoadingRing = (props) => {

    return (
        <div className={`${classes.load} ${props.className}`} />
    );
};

export default LoadingRing;