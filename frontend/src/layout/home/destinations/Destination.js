import React, { useState, useEffect, forwardRef } from "react";
import Card from "../../../UI/Card";
import classes from "./Destination.module.css";

const Destination = forwardRef((props, ref) => {
    
    const [isSelected, setIsSelected] = useState(props.selected);

    useEffect(() => {
        setIsSelected(props.selected);
    }, [props.selected]);

    const handleClick = () => {
        if (!isSelected) {
            onSelectedHandler();
        }
    };

    const onSelectedHandler = () => {
        setIsSelected(true);
        props.onSelected(props.id);
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
                    <span class="material-icons" style={{color: "yellow", fontSize: 36}}>star</span>
                </div>
            </Card>
        </li>
    );
});

export default Destination;