import React,  { useEffect, useRef } from "react";
import classes from "./Description.module.css";
import ImageList from "./ImageList";

const Description = (props) => {

    const saveDestinationHandler = () => {

    };

    const nameRef = useRef(null);

    useEffect(() => {
        const nameElement = nameRef.current;
        if (nameElement.scrollWidth > nameElement.clientWidth) {
            let fontSize = parseFloat(window.getComputedStyle(nameElement).fontSize);
            while (nameElement.scrollWidth > nameElement.clientWidth && fontSize > 0) {
                nameElement.style.fontSize = `${fontSize}px`;
                fontSize -= 1;
            }
        }
    }, [props.destination.name]);
    
    return (
        <div className={classes.container}>
            <button className={classes["save-button"]} onClick={saveDestinationHandler}>Save</button>
            <div ref={nameRef} className={classes.name}>{props.destination.name}</div>
            <span className={classes.rating}>
                <div>{`Rating: ${props.destination.rating} / 5.0`}</div>
                <span class="material-icons" style={{ color: "yellow", fontSize: 64 }}>star</span>
            </span>
            <ImageList destination={props.destination.name} />
            <div className={classes.description}>{props.destination.description}</div>
        </div>
    )
};

export default Description;