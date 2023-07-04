import React,  { useEffect, useRef } from "react";
import classes from "./Description.module.css";
import ImageList from "./ImageList";
import Card from "../../../../UI/Card";

const Description = (props) => {


    const saveDestinationHandler = () => {

    };

    const moreButtonHandler = () => {

    };

    const nameRef = useRef(null);

    const { destination } = props;
    useEffect(() => {

        if (!destination) {
            return;
        }
        
        const nameElement = nameRef.current;
        if (nameElement.scrollWidth > nameElement.clientWidth) {
            let fontSize = parseFloat(window.getComputedStyle(nameElement).fontSize);
            while (nameElement.scrollWidth > nameElement.clientWidth && fontSize > 0) {
                nameElement.style.fontSize = `${fontSize}px`;
                fontSize -= 1;
            }
        }
    }, [destination]);

    const style = {
        color: "white",
        fontSize: 36,
        marginRight: "0.5rem",
    };

    let hours = null;
    if (destination) {
        hours = destination.hours;
        if (Array.isArray(hours))
        hours = destination.hours.map((day) => {
            return (
                <div key={Math.random()}>{day}</div>
            );
        })
    }

    return (
        <div className={classes.container}>
            {/* <button className={classes["save-button"]} onClick={saveDestinationHandler}>Save</button> */}
            <Card className={classes["name-container"]}>
                <div ref={nameRef} className={classes.name}>{destination.name}</div>
            </Card>
            <ImageList destination={destination.name} />
            <div className={classes["inner-container-3"]}>
                <Card className={classes.card}>
                    <span className={classes["section-2"]}>
                        <div className={classes.description}>{destination.description}</div>
                        <div className={classes["more-button"]} onClick={moreButtonHandler}>More Info</div>
                    </span>
                </Card>
                <div className={classes["inner-container-3"]}>
                    <div className={classes["inner-container-1"]}>
                        <div className={classes["inner-container-2"]}>
                            <Card className={classes.card}>
                                <span className={classes.section}>
                                    <span class="material-icons" style={style}>star</span>
                                    <div className={classes.rating}>{`${destination.rating} / 5.0`}</div>
                                    <div style={{ marginLeft: "0.5rem" }}>{`(${destination.totalRatings})`}</div>
                                </span>
                            </Card>
                            <Card className={classes.card}>
                                <span className={classes.section}>
                                    <span class="material-icons" style={style}>location_on</span>
                                    <div>{destination.address}</div>
                                </span>
                            </Card>
                        </div>
                        <div className={classes["inner-container-2"]}>
                            <Card className={classes.card}>
                                <span className={classes.section}>
                                    <span class="material-symbols-rounded" style={style}>schedule</span>
                                    <div className={classes.hours}>{hours}</div>
                                </span>
                            </Card>
                        </div>
                    </div>
                    <div className={classes["inner-container-4"]}>
                        <Card className={classes.card}>
                            <span className={classes.section}>
                                <span class="material-symbols-rounded" style={style}>link</span>
                                {destination.website !== "N/A" ?
                                    <a
                                        href={`${destination.website}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className={classes.link}
                                    >{`${destination.website}`}
                                    </a> :
                                    destination.website
                                }
                            </span>
                        </Card>
                        <Card className={`${classes.card} ${classes["phone-number"]}`}>
                            <span className={classes.section}>
                                <span class="material-symbols-rounded" style={style}>call</span>
                                {destination.phoneNumber !== "N/A" ?
                                    <a
                                        href={`tel:${destination.phoneNumber}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className={classes.link}
                                    >{destination.phoneNumber}
                                    </a> :
                                    destination.phoneNumber
                                }
                            </span>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default Description;