import CONSTANTS from "../../../constants";
import { getRefinedGPTResponse } from "./getGPTResponse";
import { generateCityHistoryPrompt, generateDestinationShortPrompt } from "../../../prompts";

// export const fetchData = async (chatList, city, setData, setOriginalData, setDataFetched, messages, setMessages) => {

//     try {

//         let minRecommendations, minReviews, maxDistance;
//         const maxRecommendations = 10;
//         if (city.population < 100000) {
//             minRecommendations = 0;
//             minReviews = 40;
//             maxDistance = 5;
//         } else if (city.population >= 100000 && city.population < 1000000) {
//             minRecommendations = 5;
//             minReviews = 500;
//             maxDistance = 15;
//         } else if (city.population >= 1000000) {
//             minRecommendations = 10;
//             minReviews = 1000;
//             maxDistance = 25;
//         }

//         const updatedData = await dataSearch(chatList, city, minRecommendations, maxRecommendations, minReviews, maxDistance, messages, setMessages);

//         if (updatedData.length > 0) {
//             setData(updatedData);
//             setOriginalData(updatedData)
//         } else {
//             setOriginalData(null);
//             setData(null);
//         }
//         setDataFetched(true);

//     } catch (error) {
//         console.log("Error occurred while fetching data:", error);
//     }
// };

export const fetchData = async (city, setAttractions, setOriginalAttractions, setCityData, setDataFetched) => {

    try {

        let minReviews, maxDistance;
        if (city.population < 100000) {
            minReviews = 40;
            maxDistance = 5;
        } else if (city.population >= 100000 && city.population < 1000000) {
            minReviews = 500;
            maxDistance = 15;
        } else if (city.population >= 1000000) {
            minReviews = 1000;
            maxDistance = 25;
        }

        const response = await fetch(CONSTANTS.apiURL + `/googleMaps/search?city=${city.name}`);
        const data = await response.json();
        console.log("ATTRACTIONS" , data)

        if (data) {

            const cityGeometryResponse = await fetch(CONSTANTS.apiURL + `/googleMaps/location-by-address?address=${city.name}`);
            const cityGeometry = await cityGeometryResponse.json();
            console.log("CITY GEO: ", cityGeometry);

            let updatedData = await Promise.all(data.map(async (destination) => {

                let name, rating, totalRatings, website, hours, address, phoneNumber, imageUrls, reviews, geometry;

                if (!destination.name) {
                    return null;
                } else {
                    name = destination.name;
                }
                if (!destination.formatted_address) {
                    return null;
                } else {
                    address = destination.formatted_address;
                }
                if (!destination.geometry) {
                    return null;
                } else {
                    geometry = destination.geometry;
                }
                if (!destination.rating || destination.rating < 3.0) {
                    return null;
                } else {
                    rating = destination.rating;
                }
                if (!destination.user_ratings_total || destination.user_ratings_total < minReviews) {
                    return null;
                } else {
                    totalRatings = destination.user_ratings_total;
                }
                if (destination.imageUrls.length === 0) {
                    return null;
                } else {
                    imageUrls = destination.imageUrls;
                }
                if (!destination.opening_hours) {
                    if (destination.business_status) {
                        if (destination.business_status === "CLOSED_TEMPORARILY" ||
                        destination.business_status === "CLOSED_PERMANENTLY") {
                            console.log(destination.name)
                            return null;
                        } else {
                            hours = "N/A";
                        }
                    } else {
                        hours = "N/A";
                    }
                } else {
                    hours = destination.opening_hours.weekday_text;
                } 
                if (!destination.website) {
                    website = "N/A";
                } else {
                    website = destination.website;
                } 
                if (!destination.formatted_phone_number) {
                    phoneNumber = "N/A";
                } else {
                    phoneNumber = destination.formatted_phone_number;
                } 
                if (!destination.reviews) {
                    return null;
                } else {
                    reviews = destination.reviews;
                }

                const geometryResponse = await fetch(CONSTANTS.apiURL + `/googleMaps/location-by-address?address=${address}`);
                geometry = await geometryResponse.json();
                console.log("GEO: ", geometry);
                
                if (!isFinite(cityGeometry.lat) || !isFinite(cityGeometry.lng) || !isFinite(geometry.lat) || !isFinite(geometry.lng)) {
                    console.error("Invalid coordinates");
                    return;
                }
                
                const distance = getDistanceFromLatLngInKm(cityGeometry.lat, cityGeometry.lng, geometry.lat, geometry.lng);
                console.log(destination.name + " dis: " + distance);
                if (distance > maxDistance) {
                    return null;
                }

                return {
                    name,
                    rating: ((rating && Number.isInteger(rating)) ? rating + ".0" : rating),
                    totalRatings,
                    website,
                    hours,
                    address,
                    phoneNumber,
                    imageUrls,
                    reviews,
                    geometry,
                    city: city.name
                };
            }));

            updatedData = updatedData.filter((destination) => destination !== undefined && destination !== null);

            console.log("UPDATED PLACES: ", updatedData);

            if (updatedData.length === 0) {
                setAttractions(null);
                setOriginalAttractions(null);
                setCityData(null);
            } else { 
                
                //Fetch gpt descriptions
                updatedData = await Promise.all(updatedData.map(async (data) => {

                    const textInput = generateDestinationShortPrompt(data.name, city.name);
                    const textInputJSON = {
                        content: textInput
                    };

                        const response = await fetch(CONSTANTS.apiURL + "/gpt", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify(textInputJSON),
                        });

                        const result = await response.json();
                        console.log(result.data);

                        return {
                            ...data,
                            description: result.data
                        };
                }));
                console.log("FINAL PLACES W DESCRIPTION: ", updatedData);

                //Fetch city data
                const cityHistoryInput = generateCityHistoryPrompt(city.name);
                const cityHistoryInputJSON = {
                    content: cityHistoryInput
                };

                const cityResponse = await fetch(CONSTANTS.apiURL + "/gpt", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(cityHistoryInputJSON),
                });
                const cityResult = await cityResponse.json();

                const paragraphs = cityResult.data.split("\n\n");
                console.log(paragraphs);

                const cityImagesResponse = await fetch(CONSTANTS.apiURL + `/googleMaps/images-city?city=${city.name}`);
                const cityImagesResult = await cityImagesResponse.json();
                const images = cityImagesResult.imageUrls;
                console.log(images)

                if (paragraphs.length !== images.length) {
                    const minLength = Math.min(paragraphs.length, images.length);
                    paragraphs = paragraphs.slice(0, minLength);
                    images = images.slice(0, minLength);
                }

                const cityData = {
                    name: city.name,
                    paragraphs: paragraphs,
                    images: cityImagesResult.imageUrls
                };

                setCityData(cityData);
                setAttractions(updatedData);
                setOriginalAttractions(updatedData);
            }
        } else {
            setAttractions(null);
            setOriginalAttractions(null);
            setCityData(null);
        }
        setDataFetched(true);

    } catch (error) {
        console.log("Error occurred while fetching data:", error);
    }
};

const dataSearch = async (chatList, city, minRecommendations, maxRecommendations, minReviews, maxDistance, messages, setMessages) => {

    const nameArr = [];
    const cityGeometryResponse = await fetch(CONSTANTS.apiURL + `/googleMaps/location-by-address?address=${city.name}`);
    const cityGeometry = await cityGeometryResponse.json();
    console.log("CITY GEO: ", cityGeometry);
    // const cityBoundariesResponse = await fetch(CONSTANTS.apiURL + `/openStreetMap/city-boundaries?city=${city}`);
    // const cityBoundaries = await cityBoundariesResponse.json();
    // console.log("CITY BO: ", cityBoundaries);
    // const canonicalCityDropdownResponse = await fetch(CONSTANTS.apiURL + `/googleMaps/city-alias?address=${city}`);
    // const canonicalCityDropdown = await canonicalCityDropdownResponse.json();
    // const canonicalCityDropdownENResponse = await fetch(CONSTANTS.apiURL + `/translate/to-english?text=${canonicalCityDropdown}`);
    // const canonicalCityDropdownEN = await canonicalCityDropdownENResponse.json();
    let updatedData = await Promise.all(chatList.map(async (destination) => {

        try {

            const dataResponse = await fetch(CONSTANTS.apiURL + `/googleMaps/data?destination=${destination.name}&city=${city.name}`);
            const dataResult = await dataResponse.json();
            

            let rating, totalRatings, website, hours, address, phoneNumber, imageUrls, reviews, geometry;

            if (dataResult.data) {

                if (dataResult.data.name && !nameArr.includes(dataResult.data.name)) {
                    nameArr.push(dataResult.data.name);
                    destination.name = dataResult.data.name;
                } else {
                    return null;
                }
                if (dataResult.data.rating) {
                    if (dataResult.data.rating < 3.0) {
                        return null;
                    }
                    rating = dataResult.data.rating;
                } else {
                    return null;
                }
                if (dataResult.data.user_ratings_total) {
                    if (dataResult.data.user_ratings_total < minReviews) {
                        return null;
                    }
                    totalRatings = dataResult.data.user_ratings_total;
                } else {
                    return null;
                }
                if (dataResult.data.website) {
                    website = dataResult.data.website;
                } else {
                    website = "N/A";
                }
                if (dataResult.data.opening_hours) {
                    hours = dataResult.data.opening_hours.weekday_text;
                } else {
                    console.log(destination.name + " " + dataResult.data.business_status)
                    if (dataResult.data.business_status) {
                        if (dataResult.data.business_status === "CLOSED_TEMPORARILY" ||
                        dataResult.data.business_status === "CLOSED_PERMANENTLY") {
                            return null;
                        } else {
                            hours = "N/A";
                        }
                    } else {
                        hours = "N/A";
                    }
                }
                if (dataResult.data.formatted_address) {
                    
                    // const canonicalCityDestinationResponse = await fetch(CONSTANTS.apiURL + `/googleMaps/city-alias?address=${dataResult.data.formatted_address}`);
                    // const canonicalCityDestination = await canonicalCityDestinationResponse.json();
                    // const canonicalCityDestinationENResponse = await fetch(CONSTANTS.apiURL + `/translate/to-english?text=${canonicalCityDestination}`);
                    // const canonicalCityDestinationEN = await canonicalCityDestinationENResponse.json();

                    // console.log("DEST: " + dataResult.data.formatted_address)
                    // console.log("DEST CAN CITY: ", canonicalCityDestinationEN[0])
                    // console.log("ACCEPTED CAN CITY: ", canonicalCityDropdownEN[0])

                    // if (canonicalCityDropdownEN[0] === canonicalCityDestinationEN[0]) {
                    //     address = dataResult.data.formatted_address;
                    // } else {
                    //     console.log(destination.name + "\n" + dataResult.data.formatted_address)
                    //     return null;
                    // }
                    address = dataResult.data.formatted_address;
                } else {
                    return null;
                }
                if (dataResult.data.formatted_phone_number) {
                    phoneNumber = dataResult.data.formatted_phone_number;
                } else {
                    phoneNumber = "N/A";
                }
                if (dataResult.data.imageUrls.length > 0) {
                    imageUrls = dataResult.data.imageUrls;
                } else {
                    return null;
                }
                if (dataResult.data.reviews) {
                    reviews = dataResult.data.reviews;
                    console.log(destination.name);
                    console.log(reviews);
                } else {
                    return null;
                }
    
                const geometryResponse = await fetch(CONSTANTS.apiURL + `/googleMaps/location-by-address?address=${address}`);
                // if (!geometryResponse.ok) {
                //     if (geometryResponse.status === 400) {
                //         console.error("The provided address is not within the desired city.");
                        
                //     } else {
                //         console.error("An error occurred while getting the location by address.");
                //     }
                //     return null;
                // }
                geometry = await geometryResponse.json();
                console.log("GEO: ", geometry);
                
                if (!isFinite(cityGeometry.lat) || !isFinite(cityGeometry.lng) || !isFinite(geometry.lat) || !isFinite(geometry.lng)) {
                    console.error("Invalid coordinates");
                    return;
                }
                
                const distance = getDistanceFromLatLngInKm(cityGeometry.lat, cityGeometry.lng, geometry.lat, geometry.lng);
                console.log(destination.name + " dis: " + distance);
                if (distance > maxDistance) {
                    return null;
                }
                // console.log("ADDR: " + address);

            } else {
                throw new Error("No results found for: " + destination.name);
            }
                
            return {
                ...destination,
                rating: (rating && Number.isInteger(rating)) ?
                rating + ".0" :
                rating,
                totalRatings,
                website,
                hours,
                address,
                phoneNumber,
                imageUrls,
                reviews,
                geometry
            };

        } catch (error) {
            console.log("Error occurred while calling API:", error);
        }
    }));

    updatedData = updatedData.filter((destination) => destination !== undefined && destination !== null);
    if (updatedData.length > maxRecommendations) {
        updatedData = updatedData.slice(0, maxRecommendations);
    }
    
    //Search again if min recommendations is not met (based on population)
    console.log("MIN REC: " + minRecommendations)
    console.log("POPULATION: " + city.population)
    console.log("MAX DIS: " + maxDistance + "km")
    let numTries = 0;
    while (updatedData.length < minRecommendations && numTries < 3) {

        console.log("UPDATED DATA:");
        console.log(updatedData);
        try {

            const newResults = await getRefinedGPTResponse(city.name, messages, setMessages);

            let newData = await Promise.all(newResults.map(async (destination) => {

                try {
        
                    const dataResponse = await fetch(CONSTANTS.apiURL + `/googleMaps/data?destination=${destination.name}&city=${city.name}`);
                    const dataResult = await dataResponse.json();
        
                    let rating, totalRatings, website, hours, address, phoneNumber, imageUrls, reviews, geometry;
        
                    if (dataResult.data) {
        
                        if (dataResult.data.name && !nameArr.includes(dataResult.data.name)) {
                            nameArr.push(dataResult.data.name);
                            destination.name = dataResult.data.name;
                        } else {
                            return null;
                        }
                        if (dataResult.data.rating) {
                            if (dataResult.data.rating < 3.0) {
                                return null;
                            }
                            rating = dataResult.data.rating;
                        } else {
                            return null;
                        }
                        if (dataResult.data.user_ratings_total) {
                            if (dataResult.data.user_ratings_total < minReviews) {
                                return null;
                            }
                            totalRatings = dataResult.data.user_ratings_total;
                        } else {
                            return null;
                        }
                        if (dataResult.data.website) {
                            website = dataResult.data.website;
                        } else {
                            website = "N/A";
                        }
                        if (dataResult.data.opening_hours) {
                            hours = dataResult.data.opening_hours.weekday_text;
                        } else {
                            console.log(destination.name + " " + dataResult.data.business_status)
                            if (dataResult.data.business_status) {
                                if (dataResult.data.business_status === "CLOSED_TEMPORARILY" ||
                                dataResult.data.business_status === "CLOSED_PERMANENTLY") {
                                    return null;
                                }
                            } else {
                                hours = "N/A";
                            }
                        }
                        if (dataResult.data.formatted_address) {
                            address = dataResult.data.formatted_address;
                        } else {
                            return null;
                        }
                        if (dataResult.data.formatted_phone_number) {
                            phoneNumber = dataResult.data.formatted_phone_number;
                        } else {
                            phoneNumber = "N/A";
                        }
                        if (dataResult.data.imageUrls.length > 0) {
                            imageUrls = dataResult.data.imageUrls;
                        } else {
                            return null;
                        }
                        if (dataResult.data.reviews) {
                            reviews = dataResult.data.reviews;
                        } else {
                            return null;
                        }
            
                        const geometryResponse = await fetch(CONSTANTS.apiURL + `/googleMaps/location-by-address?address=${address}`);
                        
                        geometry = await geometryResponse.json();
                        console.log("GEO: ", geometry);
    
                        if (!isFinite(cityGeometry.lat) || !isFinite(cityGeometry.lng) || !isFinite(geometry.lat) || !isFinite(geometry.lng)) {
                            console.error("Invalid coordinates");
                            return;
                        }
                        const distance = getDistanceFromLatLngInKm(cityGeometry.lat, cityGeometry.lng, geometry.lat, geometry.lng);
                        console.log(destination.name + " dis: " + distance);
                        if (distance > maxDistance) {
                            return null;
                        }  
                    } else {
                        throw new Error("No results found for: " + destination.name);
                    }
                        
                    return {
                        ...destination,
                        rating: (rating && Number.isInteger(rating)) ?
                        rating + ".0" :
                        rating,
                        totalRatings,
                        website,
                        hours,
                        address,
                        phoneNumber,
                        imageUrls,
                        reviews,
                        geometry
                    };
        
                } catch (error) {
                    console.log("Error occurred while calling API:", error);
                }
                
            }));

            //Add the new results to updatedData
            newData = newData.filter((destination) => destination !== undefined && destination !== null);
            for (let i = 0; i < newData.length; i++) {
                updatedData.push(newData[i]);
                if (updatedData.length === maxRecommendations) {
                    break;
                }
            }
            numTries++;

        } catch(error) {
            console.error(error);
        }     
    }

    console.log("DATA:");
    console.log(updatedData);

    return updatedData;  
};

function getDistanceFromLatLngInKm(lat1,lng1,lat2,lng2) {
    
    var radEarth = 6371;
    var dLat = (lat2 - lat1) * (Math.PI / 180);
    var dLon = (lng2 - lng1) * (Math.PI / 180); 
    var a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos((lat1) * (Math.PI / 180)) * Math.cos((lat2) * (Math.PI / 180)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2); 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var dis = radEarth * c;

    return dis;
}
