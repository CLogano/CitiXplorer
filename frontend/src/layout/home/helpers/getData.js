import CONSTANTS from "../../../constants";

export const fetchData = async (chatList, setData, setOriginalData, setDataFetched) => {

    try {

        const updatedData = await dataSearch(chatList);

        if (updatedData.length > 0) {
            setData(updatedData);
            setOriginalData(updatedData)
            // setDestination(updatedData[0]);
            setDataFetched(true);
        }

    } catch (error) {
        console.log("Error occurred while fetching data:", error);
    }
};

const dataSearch = async (chatList) => {

    const updatedData = await Promise.all(chatList.map(async (destination) => {

        try {
            const name = destination.name;

            const dataResponse = await fetch(CONSTANTS.apiURL + `/googleMaps/data?destination=${name}`);
            const dataResult = await dataResponse.json();
            let rating, totalRatings, website, hours, address, phoneNumber;
            if (dataResult.data.rating) {
                rating = dataResult.data.rating;
            } else {
                return null;
            }
            if (dataResult.data.user_ratings_total) {
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
                hours = "N/A";
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

            const geometryResponse = await fetch(CONSTANTS.apiURL + `/geolocation/location-by-address?address=${name + ", " + destination.location}`);
            const geometry = await geometryResponse.json();
            
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
                geometry
            };

        } catch (error) {
            console.log("Error occurred while calling API:", error);
        }
    }));

    return updatedData.filter((destination) => destination !== null);  
};