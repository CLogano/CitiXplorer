import React from "react";
import classes from "./TabGroup.module.css";
import Tab from "./Tab";

const TabGroup = (props) => {

    return (
        <div className={`${classes.container} ${props.showTabs && classes.visible}`}>
            <Tab type="Map" onTabChange={props.onTabChange} selected={props.selected} />
            <Tab type="City" onTabChange={props.onTabChange} selected={props.selected} />
        </div>
    );
};

export default TabGroup;