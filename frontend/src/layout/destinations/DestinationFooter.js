import React from "react";
import classes from "./DestinationFooter.module.css"
import { useNavigate } from "react-router-dom";

const DestinationFooter = (props) => {

    const navigate = useNavigate();

    const backButtonHandler = () => {
        navigate("/");
    }
    
    const pages = <div className={classes.pages}>
        <span class={`material-symbols-rounded ${classes["arrow"]}`}>keyboard_double_arrow_left</span>
        <h4>1</h4>
        <h4>2</h4>
        <h4>3</h4>
        <h4>4</h4>
        <h4>5</h4>
        <span class={`material-symbols-rounded ${classes["arrow"]}`}>keyboard_double_arrow_right</span>
    </div>

    return (
        <footer className={classes.footer}>
            <button className={classes["back-button"]} onClick={backButtonHandler}>Back</button>
            {pages}
        </footer>
    )
};

export default DestinationFooter;