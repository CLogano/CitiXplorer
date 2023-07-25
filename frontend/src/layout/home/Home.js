import React, { Fragment, useEffect, useState, useRef } from "react";
import classes from "./Home.module.css";
import MapComponent from "./tabs/map/MapComponent";
import Modal from "../../UI/Modal";
// import { getGPTResponse } from "./helpers/getGPTResponse";
import SkeletonLoader from "../../UI/SkeletonLoader";
import { fetchData } from "./helpers/getData";
import { getFilteredHours, getFilteredRatings, getSortedData } from "./helpers/getFilteredData";
import Results from "./destinations/Results";
import TabGroup from "./tabs/TabGroup";
import CityInfo from "./tabs/city/CityInfo";
// import RefineSearch from "./destinations/RefineSearch";

const Home = (props) => {

    // const [chatList, setChatList] = useState([]);
    // const [messages, setMessages] = useState([]);
    const [dataFetched, setDataFetched] = useState(null);
    // const [data, setData] = useState(null);
    const [attractions, setAttractions] = useState(null);
    const [originalAttractions, setOriginalAttractions] = useState(null);
    const [cityData, setCityData] = useState(null);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [filterCriteria, setFilterCriteria] = useState({sort: null, rating: null, hours: null});
    const [isLoading, setIsLoading] = useState(null);
    // const [city, setCity] = useState(null);
    // const [clickedCity, setClickedCity] = useState(null);
    const [destination, setDestination] = useState(null);
    const [tab, setTab] = useState("Map");
    const mapUpdateRef = useRef();

    //Search for results from gpt given prompt and location
    // const searchHandler = async (prompt, location) => {
    //     await getGPTResponse(prompt, location, setChatList, messages, setMessages, setIsLoading, setDataFetched);
    // };

    // useEffect(() => {
    //     const userInfo = localStorage.getItem("visited");
    //     if (!userInfo) {
    //       setShowWelcomeModal(true);
    //       localStorage.setItem("visited", "true");
    //     } else {
    //         setShowWelcomeModal(false);
    //     }
    //   }, []);

    const { search, searchHandler } = props;
    useEffect(() => {

        const searchAttractions = async () => {
            console.log("SEARCHING!!")
            //setChatList(null);
            setAttractions(null);
            setCityData(null);
            setFilterCriteria({sort: null, rating: null, hours: null});
            //setMessages([]);
            setIsLoading(true);
            setDataFetched(false);
        };

        if (search) {
            setTab("Map");
            searchHandler(false);
            searchAttractions();
        }
    }, [search, searchHandler])

    

    // const refinedSearchHandler = async (prompt) => {
    //     await getRefinedGPTResponse(prompt, city, setChatList, setData, messages, setMessages, setIsLoading, setDataFetched);
    // };

    //Fetch ratings and geometry data based on gpt results and update "data" state
    // useEffect(() => {
        
    //     const getData = async () => {

    //         if (chatList && Array.isArray(chatList) && chatList.length > 0 && !dataFetched) {

    //             setDestination(null);
    //             await fetchData(chatList, city, setData, setOriginalData, setDataFetched, messages, setMessages);

    //         } else if (chatList === "N/A") {
    //             // setShowErrorModal(true);
    //             // setIsLoading(false);
    //         } else if (dataFetched) {

    //             if (originalData) {
    //                 setDestination(originalData[0]);
    //             } else {
    //                 setShowErrorModal(true);
    //             }
    //             setIsLoading(false);
    //         }
    //     };
    //     getData();
        
    // }, [chatList, dataFetched, originalData]);

    const { city } = props;
    useEffect(() => {
        
        const getData = async () => {

            if (city && dataFetched === false) {
                setDestination(null);
                await fetchData(city, setAttractions, setOriginalAttractions, setCityData, setDataFetched);
            }
            else if (dataFetched) {
                
                if (originalAttractions && cityData) {
                    setDestination(originalAttractions[0]);
                } else {
                    setShowErrorModal(true);
                }
                setIsLoading(false);
            }
        };
        getData();
        
    }, [dataFetched, originalAttractions, cityData]);

    // useEffect(() => {

    //     async function fetchGPTResponse() {
    //         await getGPTResponse(city, chatList, setChatList, messages, setMessages, setIsLoading, setDataFetched);
    //     }
    //     if (!chatList) {
    //         fetchGPTResponse();
    //     }
        
    // }, [city, chatList, messages])
    

    const onSelectedDestination = (destination) => {
        setDestination(destination);
    };

    const onSelectedTab = (tab) => {
        setTab(tab);
    }

    const cityHandler = (city) => {
        props.cityHandler(city);
        mapUpdateRef.current.forceMapUpdate();
    };

    // const clickedCityHandler = (city) => {
    //     props.cityHandler(city);
    //     props.clickedCityHandler(city);
    //     // mapUpdateRef.current.forceMapUpdate();
    // };

    const closeModalHandler = () => {
       setShowErrorModal(false);
    };

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

        if (originalAttractions) {

            if (!filterCriteria.sort && !filterCriteria.rating && !filterCriteria.hours) {
                setAttractions(originalAttractions);
            } else {
    
                let updatedAttractions = [...originalAttractions];
                
                //Filter ratings
                if (filterCriteria.rating) {
                    updatedAttractions =  getFilteredRatings(filterCriteria.rating, updatedAttractions);
                } 
                //Filter hours
                if (filterCriteria.hours) {
                    updatedAttractions = getFilteredHours(filterCriteria.hours, updatedAttractions);
                }
                //Sort at end
                if (filterCriteria.sort) {
                    updatedAttractions = getSortedData(filterCriteria.sort, updatedAttractions);
                }
    
                setAttractions(updatedAttractions);
            }
        }
        
    }, [filterCriteria, originalAttractions])

    useEffect(() => {
        if (destination && attractions && !attractions.includes(destination)) {
            setDestination(attractions[0]);
        } else if (!attractions) {
            setDestination(null);
        }
    }, [attractions, destination]);

    return (
        <Fragment>
            {/* <Header search={searchHandler} city={cityHandler} clickedCity={clickedCity}/> */}
            {showErrorModal && <Modal onClose={closeModalHandler}>
                <div className={classes["error-outer-container"]}>
                    <div className={classes["error-inner-container"]}>
                        <span class={`material-symbols-rounded ${classes["error-icon"]}`}>sentiment_dissatisfied</span>
                        <h1>Oops!</h1>
                    </div>
                    <p className={classes["error-message"]}>{`No results found for ${city.name}. Please try again or enter another city.`}</p>
                </div>
            </Modal>
            }
            <div className={classes.dashboard}>
                <TabGroup onTabChange={onSelectedTab} selected={tab} showTabs={dataFetched && attractions !== null} />
                {tab === "Map" ?
                    <Fragment>
                        <MapComponent
                            ref={mapUpdateRef}
                            address={city}
                            clickedCity={cityHandler}
                            data={attractions}
                            destination={destination}
                            onSelectedDestination={onSelectedDestination}
                        />
                        {isLoading ?
                            <SkeletonLoader /> :
                            ((isLoading !== null && attractions) &&
                                <div>
                                    <Results
                                        data={attractions}
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
                            )}
                    </Fragment> :
                    cityData && <CityInfo cityData={cityData} />   
                }

            </div>
        </Fragment>
    )
};

export default Home;