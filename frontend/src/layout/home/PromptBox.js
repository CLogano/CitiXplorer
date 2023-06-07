import React, { useCallback, useState } from "react";
import classes from "./PromptBox.module.css";

const PromptBox = (props) => {

    
    const [text, setText] = useState("");
    const [isTouched, setIsTouched] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const [isValid, setIsValid] = useState(false);
    const [showDropDown, setShowDropDown] = useState(false);
    const [topicsMatched, setTopicsMatched] = useState(0);

    const inputChangeHandler = useCallback((event) => {

        setIsTouched(true);
        setText(event.target.value);

    }, []);

    const inputBlurHandler = useCallback(() => {
        // setIsTouched(true);
        // if (onBlur) {
        //     onBlur();
        // }
    }, []);

    let isInvalid = !isValid && isTouched;

    return (
        <textarea
            className={`${classes.container}
            ${isInvalid === true ? classes.invalid : ""
        }`}
            placeholder={props.placeholder}
            onBlur={inputBlurHandler}
            onChange={inputChangeHandler}
        >

        </textarea>
    );
};

export default PromptBox;
