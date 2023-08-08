import React, { useState } from "react";
import SortFilter from "./SortFilter";
import HoursFilter from "./HoursFilter";
import RatingFilter from "./RatingFilter";
import classes from "./FilterBox.module.css";

const FilterBox = (props) => {

    const [isOpen, setIsOpen] = useState(false);
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
    const onOpenHandler = () => {
        setIsOpen(true);
    };
    const onCloseHandler = () => {
        setIsOpen(false);
    };

    return (
        <div className={classes.container}>
        <div className={`${classes["filter-button"]} ${isOpen ? classes.open : ""}`} onClick={onOpenHandler}>
            <span className={`material-symbols-rounded ${classes["filter-icon"]}`}>tune</span>
            <div className={classes.name}>Filters</div>
        </div>
        <div className={`${classes.dropdown} ${isOpen ? classes.open : ""}`}>
                <div className={["content-inner"]}>
                    <SortFilter selected={onSortChangeHandler} value={sortFilterValue} />
                    <RatingFilter selected={onRatingChangeHandler} value={ratingFilterValue} />
                </div>
                <HoursFilter selectedDay={onDayChangeHandler} selectedHours={onHoursChangeHandler} day={dayFilterValue} hours={hoursFilterValue} />
                <button className={classes.reset} onClick={resetHandler}>Reset</button>
            <span className={`material-symbols-rounded ${classes["close-icon"]}`} onClick={onCloseHandler}>close</span>
        </div>
    </div>
    );
};

export default FilterBox;