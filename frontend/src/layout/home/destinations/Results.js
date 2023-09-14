import React, { useState, useEffect, useRef } from "react";
import classes from "./Results.module.css";
import DestinationList from "./destination list/DestinationList";
import Description from "./description/Description";
import FilterList from "./filters/FilterList";
import FilterBox from "./filters/FilterBox";
import ToggleGroup from "./toggles/ToggleGroup";

const Results = (props) => {

    const destinationsRef = useRef(null);
    const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 1024);
    const [sortFilterValue, setSortFilterValue] = useState("");
    const [ratingFilterValue, setRatingFilterValue] = useState("");
    const [hoursFilterValue, setHoursFilterValue] = useState([0, 24]);
    const [dayFilterValue, setDayFilterValue] = useState("Any");

    useEffect(() => {

        const checkScreenSize = () => {
            setIsSmallScreen(window.innerWidth <= 1024);
        };
        window.addEventListener("resize", checkScreenSize);

        return () => window.removeEventListener("resize", checkScreenSize);

    }, []);

    const sortFilterHandler = (value) => {
        setSortFilterValue(value);
        props.sortFilter(value);
    };
    const ratingFilterHandler = (value) => {
        setRatingFilterValue(value);
        props.ratingFilter(value);
    };
    const hoursFilterHandler = (values) => {
        setHoursFilterValue(values);
        props.hoursFilter({hours: values, day: dayFilterValue});
    };
    const dayFilterHandler = (value) => {
        setDayFilterValue(value);
        props.hoursFilter({hours: hoursFilterValue, day: value});
    };
    const resetFilterHandler = () => {
        setSortFilterValue("");
        setRatingFilterValue("");
        setHoursFilterValue([0, 24]);
        setDayFilterValue("Any");
        props.resetFilter();
    };

    return (
        <div className={classes.container}>
            <div className={classes["inner-container"]}>
                <div className={classes.destinations} ref={destinationsRef}>
                    <DestinationList
                        destinationsRef={destinationsRef}
                        destinations={props.data}
                        onSelected={props.onSelectedDestination}
                        selected={props.destination}
                    />
                </div>
                <div className={classes["inner-container-2"]}>
                    <div className={classes.filters}>
                        {isSmallScreen ?
                            <FilterBox
                                sortFilterValue={sortFilterValue}
                                ratingFilterValue={ratingFilterValue}
                                hoursFilterValue={hoursFilterValue}
                                dayFilterValue={dayFilterValue}
                                sortFilter={sortFilterHandler}
                                ratingFilter={ratingFilterHandler}
                                hoursFilter={hoursFilterHandler}
                                dayFilter={dayFilterHandler}
                                resetFilter={resetFilterHandler}
                            />
                            :
                            <FilterList
                                sortFilterValue={sortFilterValue}
                                ratingFilterValue={ratingFilterValue}
                                hoursFilterValue={hoursFilterValue}
                                dayFilterValue={dayFilterValue}
                                sortFilter={sortFilterHandler}
                                ratingFilter={ratingFilterHandler}
                                hoursFilter={hoursFilterHandler}
                                dayFilter={dayFilterHandler}
                                resetFilter={resetFilterHandler}
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
                />
            </div>
        </div>
    )
};

export default Results;
