import React, { useState } from "react";
import classes from "./Field.module.css";

const Field = (props) => {

    const [text, setText] = useState("");
    const [isSelected, setIsSelected] = useState(false);
    
    const onInputChangeHandler = (event) => {

        setText(event.target.value);
        
        const timer = setTimeout(() => {
            props.fieldHandler(event.target.value);
        }, 250);
        
        return () => {
            clearTimeout(timer);
        };
    };

    const onFocusHandler = () => {
        setIsSelected(true);
    };

    const onBlurHandler = () => {
        setIsSelected(false);
    };

    let content;

    if (props.type === "Name" || props.type === "Email Address") {
        content = <input className={`${classes.input} ${isSelected && classes.selected}`} type="text" value={text} onChange={onInputChangeHandler} onFocus={onFocusHandler} onBlur={onBlurHandler} />;
    } else if (props.type === "Phone Number") {
        content = <input className={`${classes["phone-number"]} ${isSelected && classes.selected}`} type="number" value={text} onChange={onInputChangeHandler} onFocus={onFocusHandler} onBlur={onBlurHandler} />;
    } else if (props.type === "Zipcode") {
        content = <input className={`${classes.zipcode} ${isSelected && classes.selected}`} type="number" value={text} onChange={onInputChangeHandler} onFocus={onFocusHandler} onBlur={onBlurHandler} />;
    } else if (props.type === "Message") {
        content = <textarea className={`${classes.textbox} ${isSelected && classes.selected}`} type="text" value={text} onChange={onInputChangeHandler} onFocus={onFocusHandler} onBlur={onBlurHandler} />;
    }

    return (
        <div className={classes.container}>
            <div className={classes.type}>{`${props.type} ${props.mandatory ? "*" : ""}`}</div>
            {content}
        </div>
    );
};

export default Field;