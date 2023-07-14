import React from "react";
import ReactDOM from "react-dom";
import classes from "./Modal.module.css";

const Modal = (props) => {

    return ReactDOM.createPortal(
        (
            <div className={classes.backdrop} onClick={props.onClose}>
                <section className={classes.modal} onClick={(event) => event.stopPropagation()}>
                    {props.children}
                    <span class={`material-symbols-rounded ${classes["close-icon"]}`} onClick={props.onClose}>close</span>
                </section>
            </div>
        ),
        document.getElementById("modal-root")
    );
};

export default Modal;