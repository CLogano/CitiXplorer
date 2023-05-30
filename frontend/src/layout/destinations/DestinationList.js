import React from "react";
import Destination from "./Destination";
import classes from "./DestinationList.module.css";

const DestinationList = (props) => {

    const destinationList = props.destinations.map((destination) => {
        
        return (
            <Destination
                key={destination.name}
                id={destination.name}
                name={destination.name}
                description={destination.description}
                rating={destination.rating}
                onSelected={onSelectedHandler}
                selected={destination.name === props.selected.name ? true : false}
            />);
    });

    function onSelectedHandler(id) {
        const destination = props.destinations.find(destination => {
            return destination.name === id;
        });
        props.onSelected(destination);    
    };

    return (
        <div className={classes.container}>
            <ul className={classes.list}>{destinationList}</ul>
        </div>

  );
};

export default DestinationList;