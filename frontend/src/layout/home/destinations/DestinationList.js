import React, { useEffect } from "react";
import Destination from "./Destination";
import classes from "./DestinationList.module.css";

const DestinationList = (props) => {

    const refs = props.destinations.reduce((arr, destination) => {
        arr[destination.name] = React.createRef();
        return arr;
    }, {});

    useEffect(() => {
        if (props.selected) {
            refs[props.selected.name].current.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
            });
        }
    }, [props.selected, refs]);

    const destinationList = props.destinations.map((destination) => {
        
        return (
            <Destination
                ref={refs[destination.name]}
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