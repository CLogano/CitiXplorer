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
            const response = await fetch(CONSTANTS.apiURL + `/googleMaps/data?destination=${name}`);
            const result = await response.json();
            const { rating, geometry } = result.data;
            
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