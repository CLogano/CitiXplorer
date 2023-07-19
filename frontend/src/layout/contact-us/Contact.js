import React from "react";
import classes from "./Contact.module.css";
import ContactForm from "./ContactForm";
import QuickInfo from "./QuickInfo";
import VerticalDivider from "../../UI/VerticalDivider";

const Contact = () => {
 
    return (
        <div className={classes.container}>
            <div className={classes["image-container"]}>
                <img className={classes.image} alt="background" />
                <div className={classes["image-text"]}>Contact Us</div>
            </div>
            <div className={classes["inner-container"]}>
                <ContactForm />
                <QuickInfo />
            </div>
        </div>
    );
};

export default Contact;