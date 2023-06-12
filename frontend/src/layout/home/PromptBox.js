import React, { useCallback, useState, useEffect } from "react";
import classes from "./PromptBox.module.css";

const PromptBox = (props) => {

    const KEYWORDS = [
        {label: "Topic"},
        {label: "Rating"},
        {label: "Price"},
    ];
    
    const [text, setText] = useState("");
    const [touchedOnce, setTouchedOnce] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const [isValid, setIsValid] = useState(true);
    const [showDropDown, setShowDropDown] = useState(false);
    const [keyWordsDetected, setKeyWordsDetected] = useState(0);

    const { prompt } = props;
    const onChangeHandler = useCallback((event) => {

        if (!touchedOnce) {
            setTouchedOnce(true);
        }
        
        setText(event.target.value);
        prompt(event.target.value);

    }, [touchedOnce]);

    const onBlurHandler = useCallback(() => {
        setIsFocused(false);
    }, []);

    const onClickHandler = useCallback(() => {

        if (!touchedOnce) {
            setTouchedOnce(true);
        }
        setIsFocused(true);
    }, [touchedOnce]);

    useEffect(() => {

        if (isFocused) {
            setShowDropDown(true);
        } else {
            setShowDropDown(false);
        }

    }, [isFocused]);

    let isInvalid = !isValid && touchedOnce;

    return (
        <div className={classes["prompt-container"]}>
            <textarea
                className={`${classes["text-area"]}
                ${isInvalid === true ? classes.invalid : ""
                    }`}
                placeholder={props.placeholder}
                onBlur={onBlurHandler}
                onChange={onChangeHandler}
                onClick={onClickHandler}
                value={text}
            >

            </textarea>
            {showDropDown && (
            <div className={classes.dropdown}>
                {}
            </div>
        )}
        </div>
    );
};

export default PromptBox;
