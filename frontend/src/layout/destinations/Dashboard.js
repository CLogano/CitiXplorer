import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import DestinationList from "./DestinationList";
import classes from "./Dashboard.module.css"
import Description from "./Description";
import CONSTANTS from "../../constants";
import DestinationFooter from "./DestinationFooter";

const Dashboard = () => {

    const location = useLocation();
    const data = location.state;

    const ratingsSearch = async (data) => {

        for (let i = 0; i < data.length; i++) {

        
            try {
                const str = data[i].name + " " + data[i].location + " interior exterior";
                console.log(str)
                const response = await fetch(CONSTANTS.apiURL + `/googleRatings?destination=${str}`);
                const result = await response.json();
                data[i].rating = result.rating;

            } catch (error) {
                console.log("Error occurred while calling API:", error);
            }
        }
    };
    
    useEffect(() => {
        ratingsSearch(data);
        console.log(data);
    }, [data]);

    const [destination, setDestination] = useState(data[0]);

    const onSelectedDestination = (data) => {
        const destination = {
            name: data.name,
            location: data.location,
            description: data.description,
            rating: data.rating
        };
        setDestination(destination);
    };

    // useEffect(() => {
    //     console.log(destination);
    // }, [destination]);

    return (
        <div className={classes.background}>
            <div className={classes.container}>
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

            </div>
            <DestinationFooter />
        </div>
    );
};

export default Dashboard;