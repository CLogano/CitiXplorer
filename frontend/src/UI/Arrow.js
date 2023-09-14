import React from "react";
import classes from "./Arrow.module.css";

const Arrow = (props) => {

    const { style } = props;
    
    return (
        <div className={classes["arrow-container"]} style={style}>
            <span className={`material-symbols-rounded ${classes.arrow}`}>shift</span>
        </div>
    );
};

export default Arrow;