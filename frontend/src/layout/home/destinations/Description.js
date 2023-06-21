import React,  { useEffect, useRef } from "react";
import classes from "./Description.module.css";
import ImageList from "./ImageList";

const Description = (props) => {

    const saveDestinationHandler = () => {

    };

    const nameRef = useRef(null);

    const { destination } = props;
    useEffect(() => {

        if (!destination) {
            return;
        }
        
        const nameElement = nameRef.current;
        if (nameElement.scrollWidth > nameElement.clientWidth) {
            let fontSize = parseFloat(window.getComputedStyle(nameElement).fontSize);
            while (nameElement.scrollWidth > nameElement.clientWidth && fontSize > 0) {
                nameElement.style.fontSize = `${fontSize}px`;
                fontSize -= 1;
            }
        }
    }, [destination]);
    
    return (
        <React.Fragment>
            {destination &&
                <div className={classes.container}>
                    <button className={classes["save-button"]} onClick={saveDestinationHandler}>Save</button>
                    <div ref={nameRef} className={classes.name}>{destination.name}</div>
                    <span className={classes.rating}>
                        <div>{`Rating: ${destination.rating} / 5.0`}</div>
                        <span class="material-icons" style={{ color: "yellow", fontSize: 64 }}>star</span>
                    </span>
                    <ImageList destination={destination.name} />
                    <div className={classes.description}>{destination.description}</div>
                </div>
            }
        </React.Fragment>
        
    )
};

export default Description;