import React from "react";
import classes from "./Header.module.css";
import Search from "./search/Search";
import VerticalDivider from "../../UI/VerticalDivider";

const Header = (props) => {
    return (
        <header className={classes.header}>
            <h1>MyTrip</h1>
            <Search search={props.search} />
            <div className={classes["right-section"]}>
                <h3>About</h3>
                <VerticalDivider className={classes.divide} />
                <h3>Contact</h3>
                <VerticalDivider className={classes.divide} />
                <span class={`material-icons ${classes.account}`}>account_circle</span>
            </div>
        </header>
    )
};

export default Header;