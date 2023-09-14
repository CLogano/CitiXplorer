import React, { useRef, useContext, useEffect } from "react";
import classes from "./SearchButton.module.css";
import { RectContext } from "../../../contexts/RectContext";

const SearchButton = (props) => {

    const buttonRef = useRef(null);
    const { refs } = useContext(RectContext);
    const searchButtonRef = refs.searchButton;

    useEffect(() => {
        if (searchButtonRef.current === null) {
            searchButtonRef.current = buttonRef.current;
        }
    }, [buttonRef]);

    return (
        <button
            style={props.style ? props.style : null}
            ref={buttonRef}
            type="submit"
            className={classes["search-button"]}
        >
            <span className={`material-symbols-rounded ${classes["search-icon"]}`}>search</span>
            {props.children ? props.children : null}
        </button>
    );
};

export default SearchButton;