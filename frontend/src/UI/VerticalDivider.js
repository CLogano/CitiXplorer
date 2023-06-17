import React from "react";
import classes from "./VerticalDivider.module.css";

const VerticalDivider = (props) => {
    return (
        <div className={` ${classes.divider} ${props.className}`} />
    );
};

export default VerticalDivider;