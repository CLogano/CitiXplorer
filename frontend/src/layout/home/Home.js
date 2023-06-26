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
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(null);
    const [city, setCity] = useState("New York City, NY, United States");
    const [destination, setDestination] = useState(null);
    
    

    //Search for results from gpt given prompt and location
    const searchHandler = async (prompt, location) => {
        await getGPTResponse(prompt, location, setChatList, messages, setMessages, setIsLoading, setDataFetched);
    };

    const refinedSearchHandler = async (prompt) => {
        await getRefinedGPTResponse(prompt, city, setChatList, setData, messages, setMessages, setIsLoading, setDataFetched);
    };


    //Fetch ratings and geometry data based on gpt results and update "data" state
    useEffect(() => {
        
        const getData = async () => {

            if (chatList && chatList.length > 0 && !dataFetched) {

                setDestination(null);
                await fetchData(chatList, setData, setDataFetched);

            } else if (dataFetched) {
                setDestination(data[0]);
                setIsLoading(false);
            }
        };
        getData();
        
    }, [chatList, dataFetched, data]);
    

    const onSelectedDestination = (destination) => {
        setDestination(destination);
    };

    const cityHandler = (city) => {
        setCity(city);
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
                            />
                            <RefineSearch search={refinedSearchHandler} />
                        </div>
                    )
                }
            </div>
        </Fragment>
    )
};

export default Home;