import React, { useState } from "react";
import classes from "./FilterList.module.css";
import SortFilter from "./SortFilter";
import AmountFilter from "./AmountFilter";
import RatingFilter from "./RatingFilter";
import HoursFilter from "./HoursFilter";

const FilterList = (props) => {

    const [sortFilter, setSortFilter] = useState("");
    const [ratingFilter, setRatingFilter] = useState("");
    const [hoursFilter, setHoursFilter] = useState([0, 24]);
    const [dayFilter, setDayFilter] = useState("Any");

    const resetHandler = () => {
        props.resetFilter();
        setSortFilter("");
        setRatingFilter("");
        setHoursFilter([0, 24]);
        setDayFilter("Any");
    };

    const onSortChangeHandler = (value) => {

        setSortFilter(value);
        props.sortFilter(value);
    };
    const onRatingChangeHandler = (value) => {

        setRatingFilter(value);
        props.ratingFilter(value);
    };
    const onDayChangeHandler = (value) => {

        setDayFilter(value);
        props.hoursFilter({hours: hoursFilter, day: value});
    };
    const onHoursChangeHandler = (values) => {

        setHoursFilter(values);
        props.hoursFilter({hours: values, day: dayFilter});
    };

    return (
        <div className={classes.container}>
            <SortFilter selected={onSortChangeHandler} value={sortFilter} />
            <RatingFilter selected={onRatingChangeHandler} value={ratingFilter} />
            <HoursFilter selectedDay={onDayChangeHandler} selectedHours={onHoursChangeHandler} day={dayFilter} hours={hoursFilter}/>
            {/* <AmountFilter selected={props.amountFilter} initialAmount={props.initialAmount} /> */}
            <button className={classes.reset} onClick={resetHandler}>Reset</button>
        </div>
    )
};

export default FilterList;