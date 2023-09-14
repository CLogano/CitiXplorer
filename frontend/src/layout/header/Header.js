import React, { useState, useEffect, Fragment } from "react";
import { useNavigate } from "react-router-dom";
import classes from "./Header.module.css";
import Search from "./search/Search";
import logo from "../../pictures/logo.png"
import Menu from "./Menu";

const Header = (props) => {

    const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth > 480 && window.innerWidth < 1024);
    const [isMobileScreen, setIsMobileScreen] = useState(window.innerWidth <= 480);
    
    useEffect(() => {

        const checkScreenSize = () => {
            setIsSmallScreen(window.innerWidth > 480 && window.innerWidth < 1024);
            setIsMobileScreen(window.innerWidth <= 480);
        };
        window.addEventListener("resize", checkScreenSize);

        return () => window.removeEventListener("resize", checkScreenSize);

    }, []);

    const navigate = useNavigate();

    return (
        <header className={`${classes.header} ${isMobileScreen && classes.mobile}`}>
            {isMobileScreen ? 
            <Fragment>
                <div className={classes["mobile-section"]}>
                    <img className={classes.logo} src={logo} alt="Logo" onClick={() => navigate("/")} />
                    <Menu />
                </div>
                <Search
                    searchHandler={props.searchHandler}
                    city={props.city}
                    cityHandler={props.cityHandler} 
                />
            </Fragment> :
                <Fragment>
                    <img className={classes.logo} src={logo} alt="Logo" onClick={() => navigate("/")} />
                    <Search
                        searchHandler={props.searchHandler}
                        city={props.city}
                        cityHandler={props.cityHandler} 
                        tutorialPage={props.tutorialPage}
                    />
                    {isSmallScreen || isMobileScreen ? <Menu /> :
                        (
                            <div className={classes["right-section"]}>
                                <h3 onClick={() => navigate("/")}>Home</h3>
                                <h3 onClick={() => navigate("/about")}>About</h3>
                                <h3 onClick={() => navigate("/contact-us")}>Contact</h3>
                            </div>
                        )}
                </Fragment>
            }

        </header>
    )
};

export default Header;