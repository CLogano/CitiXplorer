import React from "react";
import classes from "./Contact.module.css";
import ContactForm from "./ContactForm";
import QuickInfo from "./QuickInfo";

const Contact = () => {

    return (
        <div className={classes.container}>
            <div className={classes["image-container"]}>
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