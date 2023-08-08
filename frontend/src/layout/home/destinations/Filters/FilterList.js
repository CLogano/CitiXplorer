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
            <SortFilter selected={onSortChangeHandler} value={sortFilterValue} />
            <RatingFilter selected={onRatingChangeHandler} value={ratingFilterValue} />
            <HoursFilter selectedDay={onDayChangeHandler} selectedHours={onHoursChangeHandler} day={dayFilterValue} hours={hoursFilterValue} />
            <button className={classes.reset} onClick={resetHandler}>Reset</button>
        </div>
    )
};

export default FilterList;