import React from "react";
import classes from "./Header.module.css";

const Header = () => {
    return (
        <header className={classes.header}>
            <h1>MyTrip</h1>
            <span class={`material-icons ${classes.account}`}>account_circle</span>
        </header>
    )
};

export default Header;