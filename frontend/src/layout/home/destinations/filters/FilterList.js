import React from "react";
import classes from "./FilterList.module.css";
import SortFilter from "./SortFilter";
import RatingFilter from "./RatingFilter";
import HoursFilter from "./HoursFilter";

const FilterList = (props) => {

    const { sortFilterValue, ratingFilterValue, hoursFilterValue, dayFilterValue } = props;

    const resetHandler = () => {
        props.resetFilter();
    };
    const onSortChangeHandler = (value) => {
        props.sortFilter(value);
    };
    const onRatingChangeHandler = (value) => {
        props.ratingFilter(value);
    };
    const onDayChangeHandler = (value) => {
        props.dayFilter(value);
    };
    const onHoursChangeHandler = (values) => {
        props.hoursFilter(values);
    };

    return (
        <div className={classes.container}>
            <SortFilter selected={onSortChangeHandler} value={sortFilterValue} style={props.style}/>
            <RatingFilter selected={onRatingChangeHandler} value={ratingFilterValue} style={props.style}/>
            <HoursFilter selectedDay={onDayChangeHandler} selectedHours={onHoursChangeHandler} day={dayFilterValue} hours={hoursFilterValue} />
            <button className={classes.reset} onClick={resetHandler} style={props.style}>Reset</button>
        </div>
    )
};

export default FilterList;