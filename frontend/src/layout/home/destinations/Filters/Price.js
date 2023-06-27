import React from "react";
import classes from "./Price.module.css";

const Price = (props) => {

    const onChangeHandler = (event) => {
        props.selected(event.target.value)
    }

    return ( 
        <div className={classes.container}>
            <span class={`material-symbols-rounded ${classes.money}`}>payments</span>
            <div className={classes.selectContainer}>
                <select className={classes.select} onChange={onChangeHandler}>
                    <option className={classes.option} value="">
                        Price
                    </option>
                    <option className={classes.option} value="$">
                    {<span class="material-symbols-rounded">attach_money</span>}
                    </option>
                    <option className={classes.option} value="$$">
                        Price
                    </option>
                    <option className={classes.option} value="$$$">
                        Rating
                    </option>
                </select>
            </div>
        </div>
    );
};

export default Price;