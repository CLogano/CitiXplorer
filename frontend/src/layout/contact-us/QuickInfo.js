import React from "react";
import classes from "./QuickInfo.module.css";
import logo from "../../pictures/logo-purple.png";

const QuickInfo = () => {
 
    // useEffect(() => {
    //     const imgPath = "../../pictures/logo-black.png";
    //     const resolvedPath = new URL(imgPath, window.location.href).href;
    //     console.log("Resolved path:", resolvedPath);
    // }, []);

    return (
        <div className={classes.container}>
            <img src={logo} alt="Logo" className={classes.logo} />
            <div className={classes["inner-container-1"]}>
                {/* <div className={classes["inner-container-2"]}>
                    <span class={`material-symbols-rounded ${classes.icon}`}>phone_iphone</span>
                    <div className={classes["inner-container-3"]}>
                        <div className={classes.type}>Phone</div>
                        <a>(914) 563-6005</a>
                    </div>
                </div> */}
                <div className={classes["inner-container-2"]}>
                    <span class={`material-symbols-rounded ${classes.icon}`}>contact_mail</span>
                    <div className={classes["inner-container-3"]}>
                        <div className={classes.type}>Email</div>
                        <a>email addy</a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuickInfo;