import React from "react";
import classes from "./RatingFilter.module.css";

const RatingFilter = (props) => {


    const onChangeHandler = (event) => {
        props.selected(event.target.value);
    };

    return ( 
        <div className={classes.container}>
            <span className={`material-icons ${classes.star}`}>star</span>
            <div className={classes.selectContainer}>
                <select className={classes.select} onChange={onChangeHandler} value={props.value}>
                    <option className={classes.option} value="">
                        Rating
                    </option>
                    <option className={classes.option} value="4.5">
                        4.5 +
                    </option>
                    <option className={classes.option} value="4.0">
                        4.0 +
                    </option>
                    <option className={classes.option} value="3.5">
                        3.5 +
                    </option>
                    <option className={classes.option} value="3.0">
                        3.0 +
                    </option>
                </select>
            </div>
        </div>
    );
};

export default RatingFilter;