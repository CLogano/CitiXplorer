import React, { useState, useRef, useEffect, useLayoutEffect, forwardRef } from "react";
import Card from "../../../../UI/Card";
import classes from "./Destination.module.css";

const Destination = forwardRef((props, ref) => {
    
    const [isSelected, setIsSelected] = useState(props.selected);

    const nameRef = useRef(null);
    const { name } = props;
    useLayoutEffect(() => {

        //Adjust font size depending on name
        const nameElement = nameRef.current;
        const nameLength = name.length;
        const maxFontSize = 18;
        const minFontSize = 10;
        const maxNameLength = 100;

        let fontSize;
        if (nameLength >= maxNameLength) {
            fontSize = minFontSize;
        } else {
            fontSize = maxFontSize - ((nameLength / maxNameLength) * (maxFontSize - minFontSize));
        }

        nameElement.style.fontSize = `${fontSize}px`;

    }, [name]);

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
                <div className={classes.name} ref={nameRef}>{props.name}</div>
                <div className={classes["rating-container"]}>
                    <div className={classes.rating}>{props.rating}</div>
                    <span className={`material-icons ${isSelected ? classes["star-selected"] : classes.star}`}>star</span>
                </div>
            </Card>
        </li>
    );
});

export default Destination;