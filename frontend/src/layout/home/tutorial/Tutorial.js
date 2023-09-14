import React, { Fragment, useContext, useState } from "react";
import classes from "./Tutorial.module.css";
import SearchBarStep from "./SearchBarStep";
import SearchButtonStep from "./SearchButtonStep";
import DestinationListStep from "./DestinationListStep";
import DescriptionStep from "./DescriptionStep";
import CityInfoStep from "./CityInfoStep";
import { RectContext } from "../../../contexts/RectContext";

const Tutorial = (props) => {

    const { closeTutorial, page, setPage } = props;

    const { rects } = useContext(RectContext);
    const { locationInput, searchButton, destinationList, description, cityInfo } = rects;

    return (
        <Fragment>
            <div className={classes.container}>
                <div className={classes["page-select"]}>
                    <button className={`${classes["page-button"]} ${page === 0 && classes.invisible}`} onClick={() => setPage(page - 1)}>
                        <span className={`material-symbols-rounded ${classes.arrow}`}>arrow_back</span>
                    </button>
                    {page < 1 ?
                        <button className={classes["page-button"]} onClick={() => setPage(page + 1)}>
                            <span className={`material-symbols-rounded ${classes.arrow} ${classes.right}`}>arrow_back</span>
                        </button>
                        :
                        <button className={classes["end-button"]} onClick={() => closeTutorial()}>
                            <span className={`material-symbols-rounded ${classes.end}`}>done</span>
                        </button>
                    }
                </div>
            </div>
            {page === 0 && <SearchBarStep rect={locationInput} />}
            {page === 1 && <SearchButtonStep rect={searchButton} />}
            {/* {page === 2 && <DestinationListStep rect={destinationList} />}
            {page === 3 && <DescriptionStep rect={description} />}
            {page === 4 && <CityInfoStep rect={cityInfo} />} */}
        </Fragment>
    );
};

export default Tutorial;