import React, { useState, useEffect, forwardRef } from "react";
import Card from "../../../../UI/Card";
import classes from "./Destination.module.css";

const Destination = forwardRef((props, ref) => {
    
    const [isSelected, setIsSelected] = useState(props.selected);

    useEffect(() => {
        setIsSelected(props.selected);
    }, [props.selected]);

    const handleClick = () => {
        if (!isSelected) {
            setIsSelected(true);
            props.onSelected(props.id);
        } else {
            // setIsSelected(false);
            // props.onSelected(null);
        }
    };

    useEffect(() => {
        if (!props.selected) {
            setIsSelected(false);
        }
    }, [props.selected]);
    
    return (
        <li ref={ref} className={classes.container} onClick={handleClick}>
            <Card className={`${classes.card} ${isSelected ? classes.selected : 
                classes["selected-reverse"]}`}>
                <div className={classes.name}>{props.name}</div>
                <div className={classes["rating-container"]}>
                    <div className={classes.rating}>{props.rating}</div>
                    <span class={`material-icons ${isSelected ? classes["star-selected"] : classes.star}`}>star</span>
                </div>
            </Card>
        </li>
    );
});

export default Destination;