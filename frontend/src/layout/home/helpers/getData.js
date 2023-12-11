import CONSTANTS from "../../../constants";
import { generateCityHistoryPrompt, generateDestinationShortPrompt } from "../../../prompts";

export const fetchData = async (city, setAttractions, setOriginalAttractions, setCityDescription, setDataFetched) => {

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

        if (!response.ok) {
            throw new Error("City search response was not ok");
        }

        const data = await response.json();

        if (process.env.NODE_ENV !== "production") {
            console.log("INITIAL LIST OF ATTRACTIONS: " , data)
        }

        if (data) {

            const cityGeometryResponse = await fetch(CONSTANTS.apiURL + `/googleMaps/location-by-address?address=${city.name}`);

            if (!cityGeometryResponse.ok) {
                throw new Error("City geometry response was not ok");
            }

            const cityGeometry = await cityGeometryResponse.json();

            let updatedData = await Promise.all(data.map(async (destination) => {

                try {

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

                    geometry = destination.geometry.location;

                    if (!isFinite(cityGeometry.lat) || !isFinite(cityGeometry.lng) || !isFinite(geometry.lat) || !isFinite(geometry.lng)) {
                        console.error("Invalid coordinates");
                        return;
                    }

                    const distance = getDistanceFromLatLngInKm(cityGeometry.lat, cityGeometry.lng, geometry.lat, geometry.lng);
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

                } catch (error) {
                    if (process.env.NODE_ENV !== "production") {
                        console.error("Error processing destination: ", error);
                    }
                    return null;
                }
            }));

            updatedData = updatedData.filter((destination) => destination !== undefined && destination !== null);

            if (process.env.NODE_ENV !== "production") {
                console.log("FILTERED LIST OF ATTRACTIONS: ", updatedData);
            }

            if (updatedData.length === 0) {
                throw new Error("Places do not meet minimum requirements to recommend");
            } else { 
                
                //Fetch gpt descriptions of each place
                updatedData = await Promise.all(updatedData.map(async (data) => {

                    try {

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

                        if (!response.ok) {
                            throw new Error("GPT request failed with status: " + response.status);
                        }

                        const result = await response.json();

                        return {
                            ...data,
                            description: result.data
                        };

                    } catch (error) {
                        if (process.env.NODE_ENV !== "production") {
                            console.error("Error process destination data: ", error);
                        }
                        return null;
                    }
                }));

                if (process.env.NODE_ENV !== "production") {
                    console.log("FINAL LIST OF ATTRACTIONS WITH GPT DESCRIPTIONS: ", updatedData);
                }

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

                if (!cityResponse.ok) {
                    throw new Error("GPT request failed with status: " + cityResponse.status);
                }
                const cityResult = await cityResponse.json();

                if (!cityResult || !cityResult.data || cityResult.data.length === 0) {
                    throw new Error("Could not generate summary for given city");
                }

                let paragraphs = cityResult.data.split("\n\n");

                if (process.env.NODE_ENV !== "production") {
                    console.log("CITY SUMMARY: ", paragraphs);
                }

                const cityImagesResponse = await fetch(CONSTANTS.apiURL + `/googleMaps/images-city?city=${city.name}`);

                if (!cityImagesResponse.ok) {
                    throw new Error(`City image response was not ok with status: ${cityImagesResponse.status}`);
                }

                const cityImagesResult = await cityImagesResponse.json();

                let images = (cityImagesResult && cityImagesResult.imageUrls) ? cityImagesResult.imageUrls : null;

                if (!images || images.length === 0) {
                    throw new Error("No images found");
                } else {

                    if (paragraphs.length !== images.length) {
                        const minLength = Math.min(paragraphs.length, images.length);
                        paragraphs = paragraphs.slice(0, minLength);
                        images = images.slice(0, minLength);
                    }
    
                    const cityDescription = {
                        name: city.name,
                        paragraphs: paragraphs,
                        images: images
                    };

                    // Create entry in database for the city
                    const cityData = {
                        name: city.name,
                        attractions: updatedData.map((data) => ({
                            name: data.name,
                            rating: data.rating,
                            totalRatings: data.totalRatings,
                            website: data.website,
                            hours: data.hours,
                            address: data.address,
                            phoneNumber: data.phoneNumber,
                            images: data.imageUrls,
                            reviews: data.reviews,
                            geometry: data.geometry
                        })),
                        description: {
                            paragraphs: cityDescription.paragraphs,
                            images: cityDescription.images
                        }
                    };
                    
                    const cityDataResponse = await fetch(CONSTANTS.apiURL + "/city", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(cityData)
                    });

                    if (!cityDataResponse.ok) {
                        throw new Error("Failed to create entry in database: " + cityDataResponse.status);
                    }
    
                    setCityDescription(cityDescription);
                    setAttractions(updatedData);
                    setOriginalAttractions(updatedData);
                }
            }

             
        } else {
            throw new Error("Data was not found");
        }

        setDataFetched(true);

    } catch (error) {

        if (process.env.NODE_ENV !== "production") {
            console.log("Error occurred while fetching data:", error);
        }
        setAttractions(null);
        setOriginalAttractions(null);
        setCityDescription(null);
        setDataFetched(true);
    }
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
