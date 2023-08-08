import React, { useEffect } from "react";
import Destination from "./Destination";
import classes from "./DestinationList.module.css";

const DestinationList = (props) => {

    const { destinations, destinationsRef, selected, onSelected } = props;

    const refs = destinations.reduce((arr, destination) => {
        arr[destination.name] = React.createRef();
        return arr;
    }, {});


    useEffect(() => {
        if (selected && refs[selected.name]) {
            const destinationMargin = 3.5 * 16; // 3.5rem to pixels. Each destination object has 3.5rem vertical margins

            const destinationsElement = destinationsRef.current;

            // Get current position of the destination relative to the container
            const rect = refs[selected.name].current.getBoundingClientRect();
            const containerRect = destinationsElement.getBoundingClientRect();

            // Calculate the relative offset from the container's current scrollTop
            const offset = rect.top - containerRect.top;

            // Determine the scroll adjustment needed to position the element 3.5rem below the header
            const scrollAdjustment = destinationsElement.scrollTop + offset - destinationMargin;

            destinationsElement.scrollTo({
                top: scrollAdjustment,
                behavior: "smooth"
            });
        }
    }, [selected, refs, destinationsRef]);

    const destinationList = destinations.map((destination) => {

        return (
            <Destination
                ref={refs[destination.name]}
                key={`${destination.name}-${destination.address}`}
                id={destination.name}
                name={destination.name}
                rating={destination.rating}
                onSelected={onSelectedHandler}
                selected={selected && destination.name === selected.name ? true : false}
            />   
        );
    });

    function onSelectedHandler(id) {
        const destination = destinations.find(destination => {
            return destination.name === id;
        });
        onSelected(destination);    
    };

    return (
        <div className={classes.container}>
            <ul className={classes.list}>{destinationList}</ul>
        </div>

  );
};

export default DestinationList;