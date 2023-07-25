import React from "react";
import classes from "./About.module.css";
import ContactForm from "../contact-us/ContactForm";
import QuickInfo from "../contact-us/QuickInfo";

const About = () => {
 
    return (
        <div className={classes.container}>
            <div className={classes["image-container"]}>
                <div className={classes["image-text"]}>About Us</div>
            </div>
            <div className={classes["inner-container"]}>
                <div className={classes["inner-container-2"]}>
                    <h1 className={classes.heading}>The One-Stop Solution to Your Travelling Needs</h1>
                    <p className={classes["top-paragraph"]}>Planning on visiting a new city soon? </p>
                </div>
                <div className={classes["inner-container-2"]}>
                <h1 className={classes.heading}>Designed for Tourists & History Buffs Alike</h1>
                    <div className={classes["inner-container-3"]}>
                        <img alt="ye"></img>
                        <p className={classes["left-paragraph"]}>Want to know why you should visit a place, or simply curious of its history? We got you covered! Powered by ChatGPT, VeloCity generates custom descriptions of each attraction that are highly detailed, easy-to-read, and user-friendly. Each description covers the history of the place, potential areas of interest nearby, and offers several reasons why you should go!</p>
                    </div>
                </div>
                <div className={classes["inner-container-2"]}>
                    <h1 className={classes.heading}>YES</h1>
                    <div className={classes["inner-container-3"]}>
                        <p className={classes["right-paragraph"]}>Yessir</p>
                        <img alt="na"></img>
                    </div>
                </div>
                <p className={classes.notice}>Note: Some results may be inaccurate due to limitations imposed by ChatGPT.</p>
            </div>
        </div>
    );
};

export default About;