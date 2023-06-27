import CONSTANTS from "../../../constants";

export const fetchData = async (chatList, setData, setDataFetched) => {

    try {

        const updatedData = await dataSearch(chatList);

        if (updatedData.length > 0) {
            setData(updatedData);
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

            const ratingResponse = await fetch(CONSTANTS.apiURL + `/googleMaps/rating?destination=${name}`);
            const ratingResult = await ratingResponse.json();
            let rating;
            if (ratingResult.rating) {
                rating = ratingResult.rating;
            } else {
                rating = "N/A";
            }

            const geometryResponse = await fetch(CONSTANTS.apiURL + `/geolocation/location-by-address?address=${name + ", " + destination.location}`);
            const geometry = await geometryResponse.json();
            
            return {
                ...destination,
                rating: (rating && Number.isInteger(rating)) ?
                rating + ".0" :
                rating,
                geometry
            };

        } catch (error) {
            console.log("Error occurred while calling API:", error);
        }
    }));
    return updatedData;  
};