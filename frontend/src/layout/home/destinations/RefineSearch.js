import React, { useEffect, useState } from "react";
import classes from "./RefineSearch.module.css";

const RefineSearch = (props) => {

    const [expand, setExpand] = useState(false);
    const [raisedOnce, setRaisedOnce] = useState(false);
    const [isValid, setIsValid] = useState(true); //change later
    const [text, setText] = useState("");

    const onSubmitHandler = (event) => {
        event.preventDefault();

        if (isValid) {
            props.search(text)
        }
    };

    const expandHandler = () => {

        if (!raisedOnce) {
            setRaisedOnce(true);
        }
        setExpand(!expand);
    };

    const onChangeHandler = (event) => {
        setText(event.target.value);
    }
    
    useEffect(() => {

        const timer = setTimeout(() => {
            expandHandler();
        }, 20000);  

        return () => {
            clearTimeout(timer);
        };

    }, []);

    return (
        <div className={`${classes.container} ${expand ? classes["expand-up"] : (raisedOnce ? classes["expand-down"] : "")}`}>
            {!expand && <span class={`material-symbols-rounded ${classes.arrow}`} onClick={expandHandler}>
                arrow_drop_up
            </span>}
            {expand && <span class={`material-symbols-rounded ${classes.arrow}`} onClick={expandHandler}>
                arrow_drop_down
            </span>}
            <h4>Not satisfied with the results?<br />Please describe your problem below and hit submit to search again:</h4>
            <form onSubmit = {onSubmitHandler} className={classes.form}>
            <textarea 
                value={text}
                autoComplete="off"
                onChange={onChangeHandler}
            />
            <button type="submit" className={classes["submit-button"]}>Submit</button>
            </form>
        </div>
    );
};

export default RefineSearch;