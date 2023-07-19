import React from "react";
import classes from "./ContactForm.module.css";
import Field from "./Field";

const ContactForm = () => {
 
    const onSubmitHandler = (event) => {
        event.preventDefault();
    };

    return (
        <form className={classes.container} onSubmit={onSubmitHandler}>
            <Field type="Name" mandatory={false} />
            <div className={classes["inner-container"]}>
                <Field type="Email Address" mandatory={true} />
                <Field type="Phone Number" mandatory={false} />
            </div>
            <Field type="Zipcode" mandatory={false} />
            <Field type="Message" mandatory={true} />
            <div className={classes["inner-container"]}>
                <button className={classes.button} type="submit">Submit</button>
                <p className={classes.notice}>* Mandatory field</p>
            </div>
        </form>
    );
};

export default ContactForm;