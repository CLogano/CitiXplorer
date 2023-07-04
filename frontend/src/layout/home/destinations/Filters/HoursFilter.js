import React, { useState } from "react";
import classes from "./HoursFilter.module.css";
import Slider from "react-slider";

const CustomThumb = (props, state) => (
    
    <div {...props} className={classes.thumb}>
        <div className={classes.tooltip}>{state.valueNow < 12 ? `${state.valueNow === 0 ? 12 : state.valueNow} AM` : (state.valueNow === 24 ? "12 AM" : `${state.valueNow === 12 ? 12 : state.valueNow % 12} PM`)}</div>
    </div>
);

const CustomTrack = (props, state) => (
    <div {...props} style={{...props.style, backgroundColor: state.index === 1 ? 'royalblue' : 'white'}} />
);

const HoursFilter = (props) => {

    const hoursChangeHandler = (newVal) => {
        props.selectedHours(newVal);       
    };

    const dayChangeHandler = (event) => {
        props.selectedDay(event.target.value);
    };

    return (
        <div className={classes.container}>
            <label className={classes.label}>Hours</label>
            <div className={classes["select-container"]}>
                <select className={classes.select} onChange={dayChangeHandler} value={props.day}>
                    <option className={classes.option} value="Any">
                        Any
                    </option>
                    <option className={classes.option} value="Monday">
                        Monday
                    </option>
                    <option className={classes.option} value="Tuesday">
                        Tuesday
                    </option>
                    <option className={classes.option} value="Wednesday">
                        Wednesday
                    </option>
                    <option className={classes.option} value="Thursday">
                        Thursday
                    </option>
                    <option className={classes.option} value="Friday">
                        Friday
                    </option>
                    <option className={classes.option} value="Saturday">
                        Saturday
                    </option>
                    <option className={classes.option} value="Sunday">
                        Sunday
                    </option>
                </select>
            </div>
            <div className={classes["slider-container"]}>
                <span className={classes.time}>12 AM</span>
                <Slider
                    className={classes.slider}
                    thumbClassName={classes.thumb}
                    trackClassName={classes.track}
                    min={0}
                    max={24}
                    step={1}
                    value={props.hours}
                    onChange={hoursChangeHandler}
                    pearling
                    minDistance={1}
                    renderThumb={CustomThumb}
                    renderTrack={CustomTrack}
                />
                <span className={classes.time}>12 AM</span>
            </div>
        </div>

    )
};

export default HoursFilter;