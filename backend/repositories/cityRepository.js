const City = require("../models/city");

const createCity = async (cityData) => {
    const city = new City(cityData);
    return await city.save();
};

const findCity = async (cityName) => {
    return await City.findOne({ name: cityName });
};

const updateCity = async (cityName, cityData) => {
    return await City.findOneAndUpdate({ name: cityName }, cityData, { new: true });
};

const deleteCity = async (cityName) => {
    return await City.findOneAndDelete(cityName);
};

module.exports = {
    createCity,
    findCity,
    updateCity,
    deleteCity
};