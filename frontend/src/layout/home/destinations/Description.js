import React,  { useEffect, useRef } from "react";
import classes from "./Description.module.css";
import ImageList from "./ImageList";
import Card from "../../../UI/Card";

const Description = (props) => {

    const saveDestinationHandler = () => {

    };

    const moreButtonHandler = () => {

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
                    <Card className={classes.card}>
                        <div ref={nameRef} className={classes.name}>{destination.name}</div>
                    </Card>
                    <div className={classes["inner-container"]}>
                        <Card className={classes.card}>
                            <span className={classes.rating}>
                                <div>{`Rating: ${destination.rating} / 5.0`}</div>
                                <span class="material-icons" style={{ color: "white", fontSize: 36 }}>star</span>
                            </span>
                        </Card>
                        <Card className={classes.card}>
                            <span className={classes.rating}>
                                <div>{`Price: ${destination.rating}`}</div>
                                <span class="material-symbols-rounded" style={{ color: "white", fontSize: 36 }}>attach_money</span>
                            </span>
                        </Card>
                    </div>
                    <ImageList destination={destination.name} />
                    <Card className={classes.card}>
                        <div className={classes.description}>{destination.description}</div>
                    </Card>
                    <div className={classes["more-button"]} onClick={moreButtonHandler}>Learn More</div>
                </div>
            }
        </React.Fragment>
        
    )
};

export default Description;