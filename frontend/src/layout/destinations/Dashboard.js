import React, { useState, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";
import DestinationList from "./DestinationList";
import classes from "./Dashboard.module.css"
import Description from "./Description";
import CONSTANTS from "../../constants";
import DestinationFooter from "./DestinationFooter";
import LoadingRing from "../../UI/LoadingRing";


const ratingsSearch = async (data) => {

    const updatedData = await Promise.all(data.map(async (destination) => {

        try {
            const name = destination.name;
            const response = await fetch(CONSTANTS.apiURL + `/googleMaps?destination=${name}`);
            const result = await response.json();
            const rating = result.content.rating;
            
            return {
                ...destination,
                rating: (rating && Number.isInteger(rating)) ?
                rating + ".0" :
                rating
            };

        } catch (error) {
            console.log("Error occurred while calling API:", error);
        }
    }));
    return updatedData;  
};

const Dashboard = () => {

    const location = useLocation();
    const [data, setData] = useState(location.state || []);
    const [destination, setDestination] = useState(null);
    const [ratingsFetched, setRatingsFetched] = useState(false);

    const fetchRatings = useCallback(async () => {

        try {

            const updatedData = await ratingsSearch(data);

            if (updatedData.length > 0) {
                setData(updatedData);
                setDestination(updatedData[0]);
            }
            setRatingsFetched(true);

        } catch (error) {
            console.log("Error occurred while fetching ratings:", error);
        }
    }, [data]);
    
      
    useEffect(() => {
        if (!ratingsFetched) {
            fetchRatings();
        }
    }, [ratingsFetched, fetchRatings]);

    const onSelectedDestination = (destination) => {
        setDestination(destination);
    };

    return (
        <div className={classes.background}>
            <div className={classes.container}>
                {ratingsFetched ? (
                    <React.Fragment>
                        <div className={classes.destinations}>
                            <DestinationList
                                destinations={data}
                                onSelected={onSelectedDestination}
                                selected={destination}
                            />
                        </div>
                        <div className={classes.description}>
                            <Description destination={destination} />
                        </div>
                    </React.Fragment>
                ) : (
                    <div className={classes.loadingContainer}>
                        <LoadingRing />
                    </div>
                )}
            </div>
            <DestinationFooter />
        </div>
    );
};

export default Dashboard;