import React, { useState } from "react";
import SortFilter from "./SortFilter";
import HoursFilter from "./HoursFilter";
import RatingFilter from "./RatingFilter";
import classes from "./FilterBox.module.css";

const FilterBox = (props) => {

    const [isOpen, setIsOpen] = useState(false);
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

    const onOpenHandler = () => {
        setIsOpen(true);
    }

    const onCloseHandler = () => {
        setIsOpen(false);
    }

    return (
        <div className={classes.container}>
        <div className={`${classes["filter-button"]} ${isOpen ? classes.open : ""}`} onClick={onOpenHandler}>
            <span className={`material-symbols-rounded ${classes["filter-icon"]}`}>tune</span>
            <div className={classes.name}>Filters</div>
        </div>
        <div className={`${classes.dropdown} ${isOpen ? classes.open : ""}`}>
                <div className={["content-inner"]}>
                    <SortFilter selected={onSortChangeHandler} value={sortFilter} />
                    <RatingFilter selected={onRatingChangeHandler} value={ratingFilter} />
                </div>
                <HoursFilter selectedDay={onDayChangeHandler} selectedHours={onHoursChangeHandler} day={dayFilter} hours={hoursFilter} />
                <button className={classes.reset} onClick={resetHandler}>Reset</button>
            <span className={`material-symbols-rounded ${classes["close-icon"]}`} onClick={onCloseHandler}>close</span>
        </div>
    </div>
    );
};

export default FilterBox;