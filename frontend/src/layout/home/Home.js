import React, { Fragment, useCallback, useEffect, useState } from "react";
import classes from "./Home.module.css";
import MapComponent from "./map/MapComponent";
import Header from "../header/Header";
import { getGPTResponse, getRefinedGPTResponse } from "./helpers/getGPTResponse";
import SkeletonLoader from "../../UI/SkeletonLoader";
import { fetchData } from "./helpers/getData";
import { getFilteredHours, getFilteredRatings, getSortedData } from "./helpers/getFilteredData";
import Results from "./destinations/Results";
// import RefineSearch from "./destinations/RefineSearch";

const Home = () => {

    const [chatList, setChatList] = useState(null);
    const [messages, setMessages] = useState([]);
    const [dataFetched, setDataFetched] = useState(false);
    const [originalData, setOriginalData] = useState(null);
    const [data, setData] = useState(null);
    const [filterCriteria, setFilterCriteria] = useState({sort: null, rating: null, hours: null});
    const [isLoading, setIsLoading] = useState(null);
    const [city, setCity] = useState("New York City, NY, United States");
    const [destination, setDestination] = useState(null);
    
    

    //Search for results from gpt given prompt and location
    // const searchHandler = async (prompt, location) => {
    //     await getGPTResponse(prompt, location, setChatList, messages, setMessages, setIsLoading, setDataFetched);
    // };

    const searchHandler = async (location) => {
        await getGPTResponse(location, setChatList, messages, setMessages, setIsLoading, setDataFetched);
    };

    // const refinedSearchHandler = async (prompt) => {
    //     await getRefinedGPTResponse(prompt, city, setChatList, setData, messages, setMessages, setIsLoading, setDataFetched);
    // };


    //Fetch ratings and geometry data based on gpt results and update "data" state
    useEffect(() => {
        
        const getData = async () => {

            if (chatList && chatList.length > 0 && !dataFetched) {

                setDestination(null);
                await fetchData(chatList, city, setData, setOriginalData, setDataFetched);

            } else if (dataFetched) {
                setDestination(originalData[0]);
                setIsLoading(false);
            }
        };
        getData();
        
    }, [chatList, city, dataFetched, originalData]);
    

    const onSelectedDestination = (destination) => {
        setDestination(destination);
    };

    const cityHandler = (city) => {
        setCity(city);
    };

    // const amountFilterHandler = (value) => {

    //     if (originalData && value <= originalData.length) {
    //         const updatedData = [...originalData].slice(0, value);
    //         setData(updatedData);
    //     }
    // };

    // const ratingFilterHandler = useCallback((value) => {
    //     getFilteredRatings(value, setData, originalData);
    // }, [originalData]);

    const sortFilterHandler = (type) => {
        const updatedCriteria = {...filterCriteria, sort: type};
        setFilterCriteria(updatedCriteria);
    };

    const ratingFilterHandler = ((value) => {
        const updatedCriteria = {...filterCriteria, rating: value};
        setFilterCriteria(updatedCriteria);
    });

    const hoursFilterHandler = ((hoursData) => {
        const updatedCriteria = {...filterCriteria, hours: hoursData};
        setFilterCriteria(updatedCriteria);
    });

    const resetFilterHandler = () => {
        setFilterCriteria({sort: null, rating: null, hours: null});
    };

    useEffect(() => {

        if (!filterCriteria.sort && !filterCriteria.rating && !filterCriteria.hours) {
            setData(originalData);
        } else {

            let updatedData = [...originalData];
            
            //Filter ratings
            if (filterCriteria.rating) {
                updatedData =  getFilteredRatings(filterCriteria.rating, updatedData);
            } 
            //Filter hours
            if (filterCriteria.hours) {
                updatedData = getFilteredHours(filterCriteria.hours, updatedData);
            }
            //Sort at end
            if (filterCriteria.sort) {
                updatedData = getSortedData(filterCriteria.sort, updatedData);
            }

            setData(updatedData);
        }
    }, [filterCriteria, originalData])

    useEffect(() => {
        if (data && !data.includes(destination)) {
            setDestination(data[0]);
        } else if (!data) {
            setDestination(null);
        }
    }, [data, destination]);

    return (
        <Fragment>
            <Header search={searchHandler} city={cityHandler}/>
            <div className={classes.dashboard}>
                <MapComponent
                    address={city}
                    data={data}
                    destination={destination}
                    onSelectedDestination={onSelectedDestination}
                />
                {isLoading ?
                    <SkeletonLoader /> :
                    ((isLoading !== null) &&
                        <div>
                            <Results
                                data={data}
                                onSelectedDestination={onSelectedDestination}
                                destination={destination}
                                sortFilter={sortFilterHandler}
                                // amountFilter={amountFilterHandler}
                                ratingFilter={ratingFilterHandler}
                                hoursFilter={hoursFilterHandler}
                                resetFilter={resetFilterHandler}
                            />
                            {/* <RefineSearch search={refinedSearchHandler} /> */}
                        </div>
                    )
                }
            </div>
        </Fragment>
    )
};

export default Home;