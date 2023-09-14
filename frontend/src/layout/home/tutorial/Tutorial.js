import React, { Fragment, useContext } from "react";
import classes from "./Tutorial.module.css";
import SearchBarStep from "./SearchBarStep";
import SearchButtonStep from "./SearchButtonStep";
import { RectContext } from "../../../contexts/RectContext";

const Tutorial = (props) => {

    const { closeTutorial, page, setPage } = props;

    const { rects } = useContext(RectContext);
    const { locationInput, searchButton } = rects;

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
        </Fragment>
    );
};

export default Tutorial;