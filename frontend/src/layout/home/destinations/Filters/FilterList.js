import React from "react";
import classes from "./FilterList.module.css";
import Sort from "./Sort";
import Amount from "./Amount";
import Rating from "./Rating";

const FilterList = (props) => {

    const resetHandler = () => {

    };

    return (
        <div className={classes.container}>
            <Sort selected={props.sortFilter} />
            <Rating selected={props.ratingFilter} />
            <Amount selected={props.amountFilter} initialAmount={props.initialAmount}/>
            <button className={classes.reset} onClick={resetHandler}>Reset</button>
        </div>
    )
};

export default FilterList;