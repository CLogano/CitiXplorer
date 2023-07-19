import React from "react";
import classes from "./DestinationImage.module.css";

const DestinationImage = (props) => {

    return (
        <img
            className={`${classes.image} ${props.modalOpen && classes["modal-open"]}`}
            src={props.src} 
            alt={props.alt} 
        />
    )

};

export default DestinationImage;