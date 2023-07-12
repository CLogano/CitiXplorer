import CONSTANTS from "../../../constants";

export const fetchData = async (chatList, city, setData, setOriginalData, setDataFetched) => {

    try {

        const updatedData = await dataSearch(chatList, city);

        if (updatedData.length > 0) {
            setData(updatedData);
            setOriginalData(updatedData)
        } else {
            setOriginalData(null);
            setData(null);
        }
        setDataFetched(true);

    } catch (error) {
        console.log("Error occurred while fetching data:", error);
    }
};

const dataSearch = async (chatList, city) => {

    const nameArr = [];
    // const cityBoundariesResponse = await fetch(CONSTANTS.apiURL + `/openStreetMap/city-boundaries?city=${city}`);
    // const cityBoundaries = await cityBoundariesResponse.json();
    // console.log("CITY BO: ", cityBoundaries);
    // const canonicalCityDropdownResponse = await fetch(CONSTANTS.apiURL + `/googleMaps/city-alias?address=${city}`);
    // const canonicalCityDropdown = await canonicalCityDropdownResponse.json();
    // const canonicalCityDropdownENResponse = await fetch(CONSTANTS.apiURL + `/translate/to-english?text=${canonicalCityDropdown}`);
    // const canonicalCityDropdownEN = await canonicalCityDropdownENResponse.json();
    const updatedData = await Promise.all(chatList.map(async (destination) => {

        try {

            const dataResponse = await fetch(CONSTANTS.apiURL + `/googleMaps/data?destination=${destination.name}&city=${city}`);
            const dataResult = await dataResponse.json();

            let rating, totalRatings, website, hours, address, phoneNumber, imageUrls, geometry;

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
                    if (dataResult.data.user_ratings_total < 100) {
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
                    //hours = ["Monday: Open 24 Hours", "Tuesday: Open 24 Hours", "Wednesday: Open 24 Hours", "Thursday: Open 24 Hours", "Friday: Open 24 Hours", "Saturday: Open 24 Hours", "Sunday: Open 24 Hours"];
                    hours = "N/A";
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
                    console.log(destination.name + "\n" + dataResult.data.formatted_address)
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
                // console.log("GEO: ", geometry);
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
                geometry
            };

        } catch (error) {
            console.log("Error occurred while calling API:", error);
        }
    }));

    console.log(updatedData.filter((destination) => destination !== undefined && destination !== null))

    return updatedData.filter((destination) => destination !== undefined && destination !== null);  
};