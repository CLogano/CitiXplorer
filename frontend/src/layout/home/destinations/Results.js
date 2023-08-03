import React, { useState, useEffect } from "react";
import classes from "./Results.module.css";
import DestinationList from "./destination list/DestinationList";
import Description from "./description/Description";
import FilterList from "./filters/FilterList";
import FilterBox from "./filters/FilterBox";
import ToggleGroup from "./toggles/ToggleGroup";

const Results = (props) => {

    const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 1024);
    // const [isMobileScreen, setIsMobileScreen] = useState(window.innerWidth <= 480);

    useEffect(() => {

        const checkScreenSize = () => {
            setIsSmallScreen(window.innerWidth <= 1024);
            // setIsMobileScreen(window.innerWidth <= 480);
        };
        window.addEventListener("resize", checkScreenSize);

        return () => window.removeEventListener("resize", checkScreenSize);

    }, []);

    const deselectHandler = () => {
        props.onSelectedDestination(null);
    };

    return (
        <div className={classes.container}>
            <div className={classes["inner-container"]}>
                <div className={classes.destinations}>
                    <DestinationList
                        destinations={props.data}
                        onSelected={props.onSelectedDestination}
                        selected={props.destination}
                    />
                </div>
                <div className={classes["inner-container-2"]}>
                    <div className={classes.filters}>
                        {isSmallScreen ?
                            <FilterBox
                                sortFilter={props.sortFilter}
                                ratingFilter={props.ratingFilter}
                                hoursFilter={props.hoursFilter}
                                resetFilter={props.resetFilter}
                            />
                            :
                            <FilterList
                                sortFilter={props.sortFilter}
                                ratingFilter={props.ratingFilter}
                                hoursFilter={props.hoursFilter}
                                resetFilter={props.resetFilter}
                            />
                        }
                    </div>
                <div className={classes.toggle}>
                    <ToggleGroup
                        toggleMarkers={props.toggleMarkers}
                        toggleCityNames={props.toggleCityNames}
                    />
                </div>
                </div>
            </div>
            <div className={classes.description}>
                <Description
                    destination={props.destination}
                    deselect={deselectHandler}
                />
            </div>
        </div>
    )
};

export default Results;
