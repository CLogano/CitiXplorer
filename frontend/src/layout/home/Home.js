import React, { Fragment, useEffect, useState, useRef } from "react";
import classes from "./Home.module.css";
import MapComponent from "./tabs/map/MapComponent";
import Modal from "../../UI/Modal";
import SkeletonLoader from "../../UI/SkeletonLoader";
import { fetchData } from "./helpers/getData";
import { getFilteredHours, getFilteredRatings, getSortedData } from "./helpers/getFilteredData";
import Results from "./destinations/Results";
import TabGroup from "./tabs/TabGroup";
import CityInfo from "./tabs/city/CityInfo";
import Tutorial from "./tutorial/Tutorial";
import CONSTANTS from "../../constants";

const Home = (props) => {

    const [dataFetched, setDataFetched] = useState(null);
    const [attractions, setAttractions] = useState(null);
    const [originalAttractions, setOriginalAttractions] = useState(null);
    const [cityDescription, setCityDescription] = useState(null);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [filterCriteria, setFilterCriteria] = useState({sort: null, rating: null, hours: null});
    const [showMarkers, setShowMarkers] = useState(true);
    const [showCityNames, setShowCityNames] = useState(true);
    const [isLoading, setIsLoading] = useState(null);
    const [destination, setDestination] = useState(null);
    const [tab, setTab] = useState("Map");
    const mapUpdateRef = useRef();

    const { search, searchHandler, showTutorial, closeTutorial, tutorialPage, setTutorialPage } = props;
    useEffect(() => {

        const searchAttractions = async () => {

            if (process.env.NODE_ENV !== "production") {
                console.log("\n")
                console.log(`SEARCHING in ${city.name}!!`)
            }
            
            setAttractions(null);
            setCityDescription(null);
            setFilterCriteria({sort: null, rating: null, hours: null});
            setIsLoading(true);
            setDataFetched(false);
        };

        if (search) {
            setTab("Map");
            searchHandler(false);
            searchAttractions();
        }
        // eslint-disable-next-line
    }, [search, searchHandler]);

    useEffect(() => {
        if (tab === "Map" && attractions && attractions.length > 0) {
          setDestination(attractions[0]);
        }
      }, [tab, attractions]);

    const { city } = props;
    useEffect(() => {
        
        const getData = async () => {

            if (city && dataFetched === false) {
                setDestination(null);

                // Check if city entry exists in database
                try {

                    const cityDataResponse = await fetch(CONSTANTS.apiURL + `/city/${encodeURIComponent(city.name)}`);

                    if (!cityDataResponse.ok) {
                        throw new Error(`HTTP error! Status: ${cityDataResponse.status}`);
                    }

                    const cityData = await cityDataResponse.json();

                    // Add name field to city description
                    const description = {
                        name: city.name,
                        paragraphs: cityData.description.paragraphs,
                        images: cityData.description.images
                    };
                    // Change images to imageUrls, add city field to attractions
                    const attr = cityData.attractions.map((attraction) => ({
                        name: attraction.name,
                        rating: attraction.rating,
                        totalRatings: attraction.totalRatings,
                        website: attraction.website,
                        hours: attraction.hours,
                        address: attraction.address,
                        phoneNumber: attraction.phoneNumber,
                        imageUrls: attraction.images,
                        reviews: attraction.reviews,
                        geometry: attraction.geometry,
                        city: city.name
                    }));

                    if (process.env.NODE_ENV !== "production") {
                        console.log("Found entry for " + city.name + "!!!");
                    }

                    setCityDescription(description);
                    setAttractions(attr);
                    setOriginalAttractions(attr);
                    setDataFetched(true);
                    
                } catch (error) {
                    if (process.env.NODE_ENV !== "production") {
                        console.log("Could not find entry in database. Creating one!");
                    }
                    // If an error occurred during fetching, call fetchData to get the relevant data and create a new database entry
                    await fetchData(city, setAttractions, setOriginalAttractions, setCityDescription, setDataFetched);
                }
            }
            else if (dataFetched) {
                
                if (originalAttractions && cityDescription) {
                    setDestination(originalAttractions[0]);
                } else {
                    setShowErrorModal(true);
                }
                setIsLoading(false);
            }
        };
        getData();
        
        // eslint-disable-next-line
    }, [dataFetched, cityDescription]);

    const onSelectedDestination = (destination) => {
        setDestination(destination);
    };

    const onSelectedTab = (tab) => {
        setTab(tab);
    }

    const cityHandler = (city) => {
        props.cityHandler(city);
        mapUpdateRef.current.forceMapUpdate();
    }

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

    const toggleMarkersHandler = (value) => {
        setShowMarkers(value);
    };
    const toggleCityNamesHandler = (value) => {
        setShowCityNames(value);
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
            {showTutorial && <Tutorial closeTutorial={closeTutorial} page={tutorialPage} setPage={setTutorialPage} />}
            {showErrorModal && <Modal onClose={closeModalHandler}>
                <div className={classes["error-outer-container"]}>
                    <div className={classes["error-inner-container"]}>
                        <span className={`material-symbols-rounded ${classes["error-icon"]}`}>sentiment_dissatisfied</span>
                        <h1 className={classes.oops}>Oops!</h1>
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
                            isLoading={isLoading}
                            destination={destination}
                            onSelectedDestination={onSelectedDestination}
                            showMarkers={showMarkers}
                            showCityNames={showCityNames}
                            tutorialPage={tutorialPage}
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
                                        ratingFilter={ratingFilterHandler}
                                        hoursFilter={hoursFilterHandler}
                                        resetFilter={resetFilterHandler}
                                        toggleMarkers={toggleMarkersHandler}
                                        toggleCityNames={toggleCityNamesHandler}
                                    />
                                </div>
                            )}
                    </Fragment> :
                    cityDescription && <CityInfo cityData={cityDescription} />
                }
            </div>
        </Fragment>
    )
};

export default Home;