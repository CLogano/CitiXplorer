import React, {useEffect} from "react";
import classes from "./Header.module.css";
import Search from "./search/Search";
import VerticalDivider from "../../UI/VerticalDivider";
import logo from "../../pictures/logo.png"

const Header = (props) => {

    useEffect(() => {
        const imgPath = "../../pictures/logo.png";
        const resolvedPath = new URL(imgPath, window.location.href).href;
        console.log("Resolved path:", resolvedPath);
    }, []);
    return (
        <header className={classes.header}>
            <img src={logo} alt="Logo" className={classes.logo}/>
            <Search search={props.search} city={props.city}/>
            <div className={classes["right-section"]}>
                <h3>About</h3>
                <VerticalDivider className={classes.divide} />
                <h3>Contact</h3>
                {/* <VerticalDivider className={classes.divide} /> */}
                {/* <span class={`material-icons ${classes.account}`}>account_circle</span> */}
            </div>
        </header>
    )
};

export default Header;