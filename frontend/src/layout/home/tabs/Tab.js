import React from "react";
import classes from "./Tab.module.css";

const Tab = (props) => {

    return (
        <div className={`${classes.container} ${props.selected === props.type ? classes.selected : ""}`} onClick={() => props.onTabChange(props.type)}>
            <div className={classes.text}>{props.type}</div>
            <span className={`material-symbols-rounded ${classes.icon}`}>{props.type  === "Map" ? "public" : "apartment"}</span>
        </div>
    );
};

export default Tab;