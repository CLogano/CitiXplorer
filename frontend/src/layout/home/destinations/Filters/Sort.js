import React from "react";
import classes from "./Sort.module.css";

const Sort = (props) => {


    const onChangeHandler = (event) => {
        props.selected(event.target.value)
    }



    return (
        <select className={classes.container} onChange={onChangeHandler} >
            <option className={classes.option} value="">Sort by</option>
            <option className={classes.option} value="Alphabetical Order">A - Z</option>
            <option className={classes.option} value="Price">Price</option>
            <option className={classes.option} value="Rating">Rating</option>
        </select>
    )
};

export default Sort;