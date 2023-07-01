import React, { Fragment, useEffect, useState } from "react";
import classes from "./Home.module.css";
import MapComponent from "./map/MapComponent";
import Header from "../header/Header";
import { getGPTResponse, getRefinedGPTResponse } from "./helpers/getGPTResponse";
import SkeletonLoader from "../../UI/SkeletonLoader";
import { fetchData } from "./helpers/getData";
import Results from "./destinations/Results";
import RefineSearch from "./destinations/RefineSearch";

const Home = () => {

    const [chatList, setChatList] = useState(null);
    const [messages, setMessages] = useState([]);
    const [dataFetched, setDataFetched] = useState(false);
    const [originalData, setOriginalData] = useState(null);
    const [data, setData] = useState(null);
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

    const refinedSearchHandler = async (prompt) => {
        await getRefinedGPTResponse(prompt, city, setChatList, setData, messages, setMessages, setIsLoading, setDataFetched);
    };


    //Fetch ratings and geometry data based on gpt results and update "data" state
    useEffect(() => {
        
        const getData = async () => {

            if (chatList && chatList.length > 0 && !dataFetched) {

                setDestination(null);
                await fetchData(chatList, setData, setOriginalData, setDataFetched);

            } else if (dataFetched) {
                setDestination(originalData[0]);
                setIsLoading(false);
            }
        };
        getData();
        
    }, [chatList, dataFetched, originalData]);
    

    const onSelectedDestination = (destination) => {
        setDestination(destination);
    };

    const cityHandler = (city) => {
        setCity(city);
    };

    const sortFilterHandler = (type) => {

        if (originalData) {

            if (type === "Rating") {

                const updatedData = [...data];
                updatedData.sort((a, b) => b.rating - a.rating);
                setData(updatedData);
            }   
            if (type === "Alphabetical Order") {
    
                const updatedData = [...data];
                updatedData.sort((a, b) => {
                    
                    const nameA = a.name.toUpperCase();
                    const nameB = b.name.toUpperCase();
                    
                    if (nameA < nameB) {
                      return -1;
                    }
                    if (nameA > nameB) {
                      return 1;
                    }
                    return 0;
                });
                setData(updatedData);
            }
        }
        
    };

    const amountFilterHandler = () => {

    };

    const ratingFilterHandler = (value) => {

        if (originalData) {

            const updatedData = [...originalData].filter((destination) => destination.rating >= value);
            setData(updatedData);
        }
        
    };

    const priceFilterHandler = () => {

    };

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
                                amountFilter={amountFilterHandler}
                                ratingFilter={ratingFilterHandler}
                                priceFilter={priceFilterHandler}
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