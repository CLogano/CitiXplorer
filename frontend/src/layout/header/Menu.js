import React, { Fragment, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import classes from "./Menu.module.css";

const Menu = () => {

    const [isOpen, setIsOpen] = useState(false);
    const [visiblePages, setVisiblePages] = useState(false);
    const buttonRef = useRef();
    const dropdownRef = useRef();
    const navigate = useNavigate();

    const homeHandler = () => {
        navigate("/");
        setIsOpen(false);
    }
    const aboutHandler = () => {
        navigate("/about");
        setIsOpen(false);
    }
    const contactHandler = () => {
        navigate("/contact-us");
        setIsOpen(false);
    }

    useEffect(() => {
        if (isOpen) {
            setVisiblePages(true);
        } else {
            setVisiblePages(false);
        }
    }, [isOpen]);

    const onClickHandler = () => {
        if (isOpen) {
            setIsOpen(false);
        } else {
            setIsOpen(true);
        }
    };

    // Handler to close the menu if clicked outside
    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target) && !buttonRef.current.contains(event.target)) {
            setIsOpen(false);
        }
    };

    // Attach "mousedown" event listener
    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <Fragment>
            <span ref={buttonRef} className={`material-symbols-rounded ${classes["menu-icon"]}`} onClick={onClickHandler}>menu</span>
            <div ref={dropdownRef} className={`${classes.dropdown} ${isOpen ? classes.open : ""}`}>
                <div className={`${classes.page} ${visiblePages ? classes.show : ""}`} onClick={homeHandler}>Home</div>
                <div className={`${classes.page} ${visiblePages ? classes.show : ""}`} onClick={aboutHandler}>About</div>
                <div className={`${classes.page} ${visiblePages ? classes.show : ""}`} onClick={contactHandler}>Contact</div>
            </div>
        </Fragment>
    )
};

export default Menu;