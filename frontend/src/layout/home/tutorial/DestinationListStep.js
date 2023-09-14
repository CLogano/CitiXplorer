import React from "react";
import classes from "./DestinationListStep.module.css";
import { destinations } from "./ExampleDestinations";
import Results from "../destinations/Results";
import Arrow from "../../../UI/Arrow";
import TabGroup from "../tabs/TabGroup";
import Card from "../../../UI/Card";
import DestinationList from "../destinations/destination list/DestinationList";

const DestinationListStep = (props) => {

    const destinationList = destinations;

    const { rect } = props;
    console.log(rect);

    if (rect) {

        const cloneStyle = {
            position: "fixed",
            left: `${rect.left}px`,
            top: `${rect.top}px`,
            width: `${rect.width}px`,
            height: `${rect.height}px`,
            margin: 0,
            pointerEvents: "none",
            zIndex: 10001,
        };     
    }

    const arrowStyle = {
        top: "50%",
        right: "50%",
        transform: "translate(-50%, -50%) rotate(90deg)"
    };

    return (
        <div>
            <TabGroup />
            <Results
                data={destinationList}
                onSelectedDestination={() => {}}
                destination={destinationList[0]}
                sortFilter={() => {}}
                ratingFilter={() => {}}
                hoursFilter={() => {}}
                resetFilter={() => {}}
                toggleMarkers={() => {}}
                toggleCityNames={() => {}}
            />
            {/* <DestinationList

                destinationsRef={null}
                destinations={destinationList}
                onSelected={() => {}}
                selected={() => {}}
            >
                <Arrow style={arrowStyle} /> 
            </DestinationList> */}
            {/* <Card className={classes["message-container"]}>
                <p className={classes.message}>To begin, enter the <b className={classes["highlight-text"]}>name</b> of a city within the search bar.</p>
                <p className={classes.message}>Use the <b className={classes["highlight-text"]}>dropdown menu</b> to select one of the options.</p>
            </Card> */}
        </div>
    );   
    
}

export default DestinationListStep;