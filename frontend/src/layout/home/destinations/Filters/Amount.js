import React, { useState } from "react";
import classes from "./Amount.module.css";

const Amount = (props) => {

    const [value, setValue] = useState(props.initialAmount);

    const onChangeHandler = (event) => {
        setValue(parseInt(event.target.value));
    };

    return (
        <div className={classes.container}>
            <label className={classes.label}>Attractions</label>
            <div className={classes.slider}>
                <span>5</span>
                <input
                    className={classes.input}
                    type="range"
                    min={5}
                    max={20}
                    step={1}
                    value={value}
                    onChange={onChangeHandler}
                >
                </input>
                <span>20</span>
            </div>
        </div>
    
    )
};

export default Amount;