import React, { useEffect, useState } from "react";
import classes from "./Toggle.module.css";

const Toggle = (props) => {

    const { toggle, initialValue, icon } = props;
    const [isToggled, setIsToggled] = useState(initialValue);

    const onToggleHandler = () => {
        setIsToggled(!isToggled);
    };

    useEffect(() => {
        toggle(isToggled);
    }, [isToggled, toggle])

    return (
        <div className={classes.container}>
            <span className={`${icon === "location_on" ? "material-icons" : "material-symbols-rounded"} ${classes.icon}`}>{icon}</span>
            <input
                type="checkbox"
                id="toggle"
                className={classes.toggle}
                checked={isToggled}
                onChange={onToggleHandler}
            >
            </input>
        </div>
    )
};

export default Toggle;