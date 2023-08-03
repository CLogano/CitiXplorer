import React,  { useState, useEffect, useLayoutEffect, useRef, Fragment } from "react";
import classes from "./Description.module.css";
import ImageList from "./ImageList";
import Details from "./Details";
import Card from "../../../../UI/Card";
import Modal from "../../../../UI/Modal";
import ReviewList from "./ReviewList";

const Description = (props) => {


    const [showModal, setShowModal] = useState(false);
    const [lockedInPlace, setLockedInPlace] = useState(false);
    const [initialExpand, setInitialExpand] = useState(true);
    const [hasRendered, setHasRendered] = useState(false);
    const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 1024);
    
    useEffect(() => {

        const checkScreenSize = () => {
            setIsSmallScreen(window.innerWidth > 480 && window.innerWidth <= 1024);
        };
        window.addEventListener("resize", checkScreenSize);

        return () => window.removeEventListener("resize", checkScreenSize);

    }, []);

    const moreButtonHandler = () => {
        setShowModal(true);
    };

    const closeModalHandler = () => {
        setShowModal(false);
    }

    const lockHandler = () => {
        setLockedInPlace(!lockedInPlace);
    };

    useEffect(() => {
        const timer = setTimeout(() => {
          setHasRendered(true);
        }, 100); // Adjust delay as needed
      
        // Cleanup function to clear the timeout if the component unmounts
        return () => clearTimeout(timer);
      }, []);

    const nameRef = useRef(null);
    const { destination } = props;
    useLayoutEffect(() => {

        if (!destination) {
            return;
        }

        //Adjust font size depending on name
        const nameElement = nameRef.current;
        const nameLength = destination.name.length;
        const maxFontSize = 40;
        const minFontSize = 16;
        const maxNameLength = 100;

        let fontSize;
        if (nameLength >= maxNameLength) {
            fontSize = minFontSize;
        } else {
            fontSize = maxFontSize - ((nameLength / maxNameLength) * (maxFontSize - minFontSize));
        }

        nameElement.style.fontSize = `${fontSize}px`;

        setInitialExpand(true);

    }, [destination]);

    const iconStyle = {
        color: "white",
        fontSize: 30,
        marginRight: "0.5rem"
    };

    //Dynamic rating
    const filledStars = parseInt(destination.rating);
    const unfilledStars = destination.rating - filledStars;
    const clipPath = `inset(0 0 0 ${50}%)`;
    const stars = <div className={classes.stars}>

        {[...Array(5)].map((_, index) => {

            if (index < filledStars) {
                return <span key={index} className={`material-icons ${classes["outer-star"]}`}>star</span>
            } else if (index === filledStars && unfilledStars > 0) {
                return (<span key={index} className={`material-icons ${classes["outer-star"]}`}>star
                    <span className={`material-icons ${classes["inner-star"]}`} style={{ clipPath }}>star</span>
                </span>);
            } else if (index > filledStars) {
                return (<span key={index} className={`material-icons ${classes["outer-star"]}`}>star
                    <span className={`material-icons ${classes["inner-star"]}`}>star</span>
                </span>);
            }
            return null;
        })}
    </div>

    let hours = "N/A";
    if (destination) {
        hours = destination.hours;
        if (Array.isArray(hours))
            hours = destination.hours.map((day) => {
                return (
                    <div key={day}>{day}</div>
                );
            })
    }

    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    return (
        <div className={`${classes.container} ${((lockedInPlace || initialExpand) && hasRendered) ? classes.locked : ""}`} onMouseLeave={() => setInitialExpand(false)}>
            {showModal && <Modal onClose={closeModalHandler}>
                <Details destination={destination} />
            </Modal>}
            <span className={`material-symbols-rounded ${classes["lock-icon"]} ${lockedInPlace ? classes["lock-icon-locked"] : classes["locked-icon-unlocked"]}`} onClick={lockHandler}>{`${lockedInPlace ? "lock" : "lock_open"}`}</span>
            <div className={classes["inner-container-1"]}>
                <span className={`material-symbols-rounded ${classes.arrow}`}>
                    arrow_drop_up
                </span>
                <div className={classes.content}>
                    <div className={classes.padding}>
                        <Card className={classes.card}>
                            <div ref={nameRef} className={classes.name}>{destination.name}</div>
                        </Card>
                        <Card className={classes.card}>
                            <ImageList destination={destination} />
                        </Card>
                        <div className={classes["inner-container-3"]}>
                            <Card className={classes.card}>
                                <span className={classes["section-2"]}>
                                    <div className={classes.description}>{destination.description}</div>
                                    <div className={classes["more-button"]} onClick={moreButtonHandler}>CLICK HERE TO LEARN MORE !</div>
                                </span>
                            </Card>
                            <div className={classes["inner-container-3"]}>
                                <div className={classes["inner-container-4"]}>
                                    <div className={classes["inner-container-2"]}>
                                        <Card className={classes.card}>
                                            <span className={classes.section}>
                                                <div className={classes.rating}>{destination.rating}</div>
                                                {stars}
                                                <div className={classes["total-ratings"]}>{`(${destination.totalRatings})`}</div>
                                            </span>
                                        </Card>
                                    </div>
                                    {isSmallScreen ? 
                                        <div className={classes["inner-container-2"]}>
                                            <Card className={classes.card}>
                                                <ReviewList destination={destination} />
                                            </Card>
                                        </div> :
                                    <div className={classes["inner-container-2"]}>
                                        <Card className={classes.card}>
                                            <span className={classes.section}>
                                                <span className="material-icons" style={iconStyle}>location_on</span>
                                                <div className={classes.address}>{destination.address}</div>
                                            </span>
                                        </Card>
                                    </div>    
                                    }     
                                </div>
                                <div className={classes["inner-container-4"]}>
                                    {isSmallScreen ?
                                        <Fragment>
                                            <div className={classes["inner-container-2"]}>
                                                <Card className={classes.card}>
                                                    <span className={classes.section}>
                                                        <span className="material-symbols-rounded" style={iconStyle}>schedule</span>
                                                        <div className={classes.hours}>{hours}</div>
                                                    </span>
                                                </Card>
                                            </div>
                                            <Card className={classes.card}>
                                                <span className={classes.section}>
                                                    <span className="material-icons" style={iconStyle}>location_on</span>
                                                    <div className={classes.address}>{destination.address}</div>
                                                </span>
                                            </Card>
                                        </Fragment>
                                        :
                                        <Fragment>
                                            <div className={classes["inner-container-2"]}>
                                                <Card className={classes.card}>
                                                    <ReviewList destination={destination} />
                                                </Card>
                                            </div>
                                            <div className={classes["inner-container-2"]}>
                                                <Card className={classes.card}>
                                                    <span className={classes.section}>
                                                        <span className="material-symbols-rounded" style={iconStyle}>schedule</span>
                                                        <div className={classes.hours}>{hours}</div>
                                                    </span>
                                                </Card>
                                            </div>
                                        </Fragment>
                                    }
                                </div>
                                <div className={classes["inner-container-4"]}>
                                    <div className={classes["inner-container-2"]}>
                                        <Card className={classes.card}>
                                            <span className={classes.section}>
                                                <span className="material-symbols-rounded" style={iconStyle}>link</span>
                                                {destination.website !== "N/A" ?
                                                    <a
                                                        href={`${destination.website}`}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className={classes.link}
                                                    >{`${destination.website}`}
                                                    </a> :
                                                    <div className={classes.link}>{destination.website}</div>
                                                }
                                            </span>
                                        </Card>
                                    </div>
                                    <div className={classes["inner-container-2"]}>
                                        <Card className={`${classes.card} ${classes["phone-number"]}`}>
                                            <span className={classes.section}>
                                                <span className="material-symbols-rounded" style={iconStyle}>call</span>
                                                {destination.phoneNumber !== "N/A" ?
                                                    isMobile ?
                                                        <a
                                                            href={`tel:${destination.phoneNumber}`}
                                                            className={classes.link}
                                                        >
                                                            {destination.phoneNumber}
                                                        </a> :
                                                        <div className={classes.link}>{destination.phoneNumber}</div>
                                                    :
                                                    <div className={classes.link}>{destination.phoneNumber}</div>
                                                }
                                            </span>
                                        </Card>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default Description;