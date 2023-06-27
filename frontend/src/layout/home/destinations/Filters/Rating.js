import React from "react";
import classes from "./Rating.module.css";

const Rating = (props) => {

    const onChangeHandler = (event) => {
        props.selected(event.target.value)
    }

    return ( 
        <div className={classes.container}>
            <span className={`material-icons ${classes.star}`}>star</span>
            <div className={classes.selectContainer}>
                <select className={classes.select} onChange={onChangeHandler}>
                    <option className={classes.option} value="">
                        Rating
                    </option>
                    <option className={classes.option} value="Alphabetical Order">
                        A - Z
                    </option>
                    <option className={classes.option} value="Price">
                        Price
                    </option>
                    <option className={classes.option} value="Rating">
                        Rating
                    </option>
                </select>
            </div>
        </div>
    );
};

export default Rating;