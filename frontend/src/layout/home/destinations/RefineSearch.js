import React from "react";
import classes from "./RefineSearch.module.css";

const RefineSearch = (props) => {

    const onSubmitHandler = (event) => {
        event.preventDefault();
    };

    return (
        <div className={classes.container}>
            <h4>Not satisfied with the results?<br />Please describe your problem below and hit submit to search again:</h4>
            <form onSubmit = {onSubmitHandler} className={classes.form}>
            <textarea>

            </textarea>
            <button type="submit" className={classes["submit-button"]}>Submit</button>
            </form>
        </div>
    );
};

export default RefineSearch;