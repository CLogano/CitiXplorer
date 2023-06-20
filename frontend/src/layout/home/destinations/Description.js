import React from "react";
import classes from "./Description.module.css";
import ImageList from "./ImageList";
import Card from "../../../UI/Card";

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
        </Card>
    )
};

export default Description;