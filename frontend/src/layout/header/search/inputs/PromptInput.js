import React, { useState, useEffect, useCallback, useRef } from "react";
import classes from "./PromptInput.module.css";

const PromptInput = (props) => {

    const [text, setText] = useState("");
    const [touchedOnce, setTouchedOnce] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const [isValid, setIsValid] = useState(null);
    const promptRef = useRef(null);

    const { prompt } = props;
    const onChangeHandler = useCallback((event) => {

        if (!touchedOnce) {
            setTouchedOnce(true);
        }

        setText(event.target.value);

        const identifier = setTimeout(() => {

            prompt(event.target.value);
            
        }, 300);

        return () => {
            clearTimeout(identifier);
        };

    }, [touchedOnce, prompt]);


    const onBlurHandler = useCallback(() => {
        setIsFocused(false);
    }, []);

    const onClickHandler = useCallback(() => {

        if (!touchedOnce) {
            setTouchedOnce(true);
        }
        setIsFocused(true);
    }, [touchedOnce]);


    const deleteInput = () => {
        setText("");
        promptRef.current.focus();
    };

    let isInvalid = !isValid && touchedOnce;


return (
    <div className={classes["prompt-container"]}>
        <div className={`${classes["prompt"]}
                ${isInvalid === true ? classes.invalid : ""
            }`}>
            <span class={`material-symbols-rounded ${classes["prompt-icon"]}`}>robot_2</span>
            <input
                type={props.type}
                id={props.id}
                value={text}
                onClick={onClickHandler}
                onChange={onChangeHandler}
                onBlur={onBlurHandler}
                placeholder={props.placeholder}
                autoComplete="off"
                ref={promptRef}
            />
            <span class={`material-symbols-rounded ${classes["close-icon"]}`} onClick={deleteInput}>close</span>
        </div>
    </div>
    );
};

export default PromptInput;