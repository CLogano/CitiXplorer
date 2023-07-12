import React from "react";
import classes from "./Modal.module.css";

const Modal = (props) => {

    return (

        <React.Fragment>
            <div className={classes.backdrop} onClick={props.onClose}>
                <section className={classes.modal} onClick={(event) => event.stopPropagation()}>
                    {props.children}
                    <span class={`material-symbols-rounded ${classes["close-icon"]}`} onClick={props.onClose}>close</span>
                </section>
            </div>
        </React.Fragment>
    );
};

export default Modal;