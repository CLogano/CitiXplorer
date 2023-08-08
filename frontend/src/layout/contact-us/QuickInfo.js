import React from "react";
import classes from "./QuickInfo.module.css";
import logo from "../../pictures/logo-purple.png";

const QuickInfo = () => {

    return (
        <div className={classes.container}>
            <img src={logo} alt="Logo" className={classes.logo} />
            <div className={classes["inner-container-1"]}>
                <div className={classes["inner-container-2"]}>
                    <span className={`material-symbols-rounded ${classes.icon}`}>contact_mail</span>
                    <div className={classes["inner-container-3"]}>
                        <div className={classes.type}>Email</div>
                        <a className={classes.email} href="mailto:info@citixplorer.com">info@citixplorer.com</a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuickInfo;