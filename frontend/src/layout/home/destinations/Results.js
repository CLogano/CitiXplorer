import React from "react";
import classes from "./Results.module.css";
import DestinationList from "./DestinationList";
import Description from "./Description";
import FilterList from "./Filters/FilterList";

const Results = (props) => {

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
                <div className={classes.filters}>
                    <FilterList 
                        sortFilter={props.sortFilter}
                        amountFilter={props.amountFilter}
                        ratingFilter={props.ratingFilter}
                        priceFilter={props.priceFilter}
                    />
                </div>
            </div>
            <div className={classes.description}>
                <Description destination={props.destination} />
            </div>
        </div>
    )
};

export default Results;
