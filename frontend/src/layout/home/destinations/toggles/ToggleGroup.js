import React from "react";
import classes from "./ToggleGroup.module.css";
import Toggle from "./Toggle";

const ToggleGroup = (props) => {

    return (
        <div className={classes.container}>
            <Toggle icon="location_on" toggle={props.toggleMarkers} initialValue={true} />
            <Toggle icon="apartment" toggle={props.toggleCityNames} initialValue={false} />
        </div>
    )
};

export default ToggleGroup;