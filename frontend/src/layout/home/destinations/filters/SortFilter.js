import React from "react";
import classes from "./SortFilter.module.css";

const SortFilter = (props) => {

    const onChangeHandler = (event) => {
        props.selected(event.target.value);
        
    }

    return (
        <div className={classes.container}>
            <select className={classes.select} onChange={onChangeHandler} value={props.value}>
                <option className={classes.option} value="">Sort by</option>
                <option className={classes.option} value="Alphabetical Order">A - Z</option>
                <option className={classes.option} value="Popularity">Popularity</option>
                <option className={classes.option} value="Rating">Rating</option>
            </select>
            <span className={`material-symbols-rounded ${classes.arrow}`}>expand_more</span>
        </div>
        
    )
};

export default SortFilter;