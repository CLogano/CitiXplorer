import React, { useState, useRef, useImperativeHandle, useEffect, useCallback} from "react";
import classes from "./SearchInput.module.css";

const SearchInput = React.forwardRef((props, ref) => {

    const [text, setText] = useState("");
    const [isTouched, setIsTouched] = useState(false);
    const inputRef = useRef();

    const activate = () => {
        inputRef.current.focus();
    };
    
    useImperativeHandle(ref, () => {
        return {
            focus: activate,
        };
    });

    const inputChangeHandler = useCallback((event) => {
        setIsTouched(true);
        setText(event.target.value);
    }, []);
    const selectTerm = useCallback((term) => {
        setIsTouched(true);
        setText(term);
    }, []);
    const { onBlur } = props;
    const inputBlurHandler = useCallback(() => {
        setIsTouched(true);
        if (onBlur) {
            onBlur();
        }
    }, [onBlur]);

    const { input } = props;
    useEffect(() => {
        input(text);
    }, [text, input]);

    const isInvalid = !props.isValid && isTouched;


    return (
        <div className={classes["search-container"]}>
            <div className={`${classes["search-inner"]}
                ${isInvalid === true ? classes.invalid : ""
            }`}>
                <input 
                    ref={inputRef}
                    type={props.type}
                    id={props.id}
                    value={text}
                    onChange={inputChangeHandler}
                    onBlur={inputBlurHandler}
                    placeholder={props.placeholder}
                />
            </div>
            <div className={classes.dropdown}>
                {props.searchTerms
                    .filter(item => {
                        const searchTerm = text.toLowerCase();
                        const term = item.content.toLowerCase();
                        return searchTerm && term.includes(searchTerm) && term !== searchTerm;
                    })
                    .slice(0, 10)
                    .map(item => (
                        <div
                            className={classes["dropdown-row"]}
                            key={item.content}
                            onClick={() => selectTerm(item.content)}
                        >{item.content}
                        </div>
                    ))}
            </div>
        </div>
    )
});

export default SearchInput;