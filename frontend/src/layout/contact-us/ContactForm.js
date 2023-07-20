import React, { Fragment, useEffect, useState } from "react";
import classes from "./ContactForm.module.css";
import ReCAPTCHA from "react-google-recaptcha";
import Field from "./Field";
import CONSTANTS from "../../constants";
import Modal from "../../UI/Modal";

const ContactForm = () => {
 
    const [captchaValue, setCaptchaValue] = useState(null);
    const [name, setName] = useState("");
    const [emailAddress, setEmailAddress] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [zipcode, setZipcode] = useState("");
    const [message, setMessage] = useState("");
    const [formIsValid, setFormIsValid] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    useEffect(() => {

        if (captchaValue && emailAddress !== "" && message !== "") {
            setFormIsValid(true);
        } else {
            setFormIsValid(false);
        }
        
    }, [captchaValue, name, emailAddress, phoneNumber, zipcode, message])

    const onSubmitHandler = async (event) => {
        
        event.preventDefault();
        if (formIsValid) {
            
            const data = {
                name: name,
                emailAddress: emailAddress,
                phoneNumber: phoneNumber,
                zipcode: zipcode,
                message: message
            };

            const response = await fetch(CONSTANTS.apiURL + "/googleSheets/contact", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();
            
            if (result.message === "Data submitted successfully") {

                //Send automated email

                setShowSuccessModal(true);
            }
        }
    };
    
    const nameChangeHandler = (name) => {
        setName(name);
    };
    const emailChangeHandler = (emailAddress) => {
        setEmailAddress(emailAddress);
    };
    const phoneNumberChangeHandler = (phoneNumber) => {
        setPhoneNumber(phoneNumber);
    };
    const zipcodeChangeHandler = (zipcode) => {
        setZipcode(zipcode);
    };
    const messageChangeHandler = (message) => {
        setMessage(message);
    };
    const captchaChangeHandler = (value) => {
        setCaptchaValue(value);
    };

    const closeModalHandler = () => {
        setShowSuccessModal(false);
    };

    return (
        <Fragment>
            {showSuccessModal && 
                <Modal onClose={closeModalHandler}>
                    <div className={classes["modal-container"]}>
                        <div className={classes["modal-container-inner"]}>
                            <h1 className={classes["text-thanks"]}>THANK YOU !</h1>
                        <span class={`material-symbols-rounded ${classes["smile-icon"]}`}>sentiment_satisfied</span>
                        </div>
                        <p className={classes["text-rest"]}>Your response has been received. We will try to answer you as quickly as possible!</p>
                    </div>
                </Modal>
            }
            <form className={classes.container} onSubmit={onSubmitHandler}>
                <Field type="Name" mandatory={false} fieldHandler={nameChangeHandler} />
                <div className={classes["inner-container"]}>
                    <Field type="Email Address" mandatory={true} fieldHandler={emailChangeHandler} />
                    <Field type="Phone Number" mandatory={false} fieldHandler={phoneNumberChangeHandler} />
                </div>
                <Field type="Zipcode" mandatory={false} fieldHandler={zipcodeChangeHandler} />
                <Field type="Message" mandatory={true} fieldHandler={messageChangeHandler} />
                <ReCAPTCHA
                    className={classes.captcha}
                    sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
                    onChange={captchaChangeHandler}
                />
                <div className={classes["inner-container-2"]}>
                    <button className={`${formIsValid ? classes.button : classes["invalid-button"]}`} type="submit">Submit</button>
                    <p className={classes.notice}>* Mandatory field</p>
                </div>
            </form>
        </Fragment>
    );
};

export default ContactForm;