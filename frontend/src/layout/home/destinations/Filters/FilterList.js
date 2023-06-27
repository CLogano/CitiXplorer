import React from "react";
import classes from "./FilterList.module.css";
import Sort from "./Sort";
import Amount from "./Amount";
import Rating from "./Rating";
import Price from "./Price";

const FilterList = (props) => {
    return (
        <div className={classes.container}>
            <Sort selected={props.sortFilter} />
            <Amount selected={props.amountFilter} />
            <Rating selected={props.ratingFilter} />
            <Price selected={props.priceFilter} />
        </div>
    )
};

export default FilterList;