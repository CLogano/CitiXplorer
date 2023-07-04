import React, { useState } from "react";
import classes from "./AmountFilter.module.css";
import Slider from "react-slider";

const CustomThumb = (props, state) => (
    
    <div {...props} className={classes.thumb}>
        <div className={classes.tooltip}>{state.valueNow}</div>
    </div>
);

const CustomTrack = (props, state) => (
    <div {...props} style={{...props.style, backgroundColor: state.index === 1 ? 'white' : 'royalblue'}} />
);

const AmountFilter = (props) => {

    const [value, setValue] = useState(props.initialAmount);

    const onChangeHandler = (newVal) => {
        setValue(parseInt(newVal));
    };

    return (
        <div className={classes.container}>
            <label className={classes.label}>Attractions</label>
            <div className={classes["slider-container"]}>
                <span>5</span>
                <Slider
                    className={classes.slider}
                    thumbClassName={classes.thumb}
                    trackClassName={classes.track}
                    min={5}
                    max={20}
                    step={1}
                    value={value}
                    onChange={onChangeHandler}
                    pearling
                    renderThumb={CustomThumb}
                    renderTrack={CustomTrack}
                />
                <span>20</span>
            </div>
        </div>
    );
};

export default AmountFilter;