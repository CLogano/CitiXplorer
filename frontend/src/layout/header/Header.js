import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import classes from "./Header.module.css";
import Search from "./search/Search";
import VerticalDivider from "../../UI/VerticalDivider";
import logo from "../../pictures/logo.png"

const Header = (props) => {

    const navigate = useNavigate();

    useEffect(() => {
        const imgPath = "../../pictures/logo.png";
        const resolvedPath = new URL(imgPath, window.location.href).href;
        console.log("Resolved path:", resolvedPath);
    }, []);
    return (
        <header className={classes.header}>
            <img src={logo} alt="Logo" className={classes.logo} onClick={() => navigate("/")}/>
            <Search searchHandler={props.searchHandler} city={props.city} cityHandler={props.cityHandler} />
            <div className={classes["right-section"]}>
                <h3 onClick={() => navigate("/")}>Home</h3>
                <VerticalDivider className={classes.divide} />
                <h3 onClick={() => navigate("/about")}>About</h3>
                <VerticalDivider className={classes.divide} />
                <h3 onClick={() => navigate("/contact-us")}>Contact</h3>
                {/* <VerticalDivider className={classes.divide} /> */}
                {/* <span class={`material-icons ${classes.account}`}>account_circle</span> */}
            </div>
        </header>
    )
};

export default Header;