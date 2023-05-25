import React from "react";
import classes from "./Description.module.css";
import ImageList from "./ImageList";
import Card from "../../UI/Card";

const Description = (props) => {

    const saveDestinationHandler = () => {

    };
    
    return (
        <Card className={classes.container}>
            <button className={classes["save-button"]} onClick={saveDestinationHandler}>Save</button>
            <div className={classes.name}>{props.destination.name}</div>
            <span className={classes.rating}>
                <div>{`Rating: ${props.destination.rating} / 5.0`}</div>
                <span class="material-icons" style={{color: "yellow", fontSize: 64}}>star</span>
            </span>
            <ImageList destination={props.destination.name} />
            <div className={classes.description}>{props.destination.description}</div>
            <span className={classes.maps}>
                <a 
                    href={`https://www.google.com/maps?q=${props.destination.name}`}
                    target="_blank"
                    rel="noreferrer">Google Maps
                </a>
                <span class="material-icons">location_on</span>
            </span>
        </Card>
    )
};

export default Description;