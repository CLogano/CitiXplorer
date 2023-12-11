const express = require("express");
const router = express.Router();
const cityRepo = require("../repositories/cityRepository");

// POST request to add a new city
router.post("/", async (req, res) => {
    console.log(req.body);
    const cityData = req.body;
    const newCity = await cityRepo.createCity(cityData);
    res.status(201).json(newCity);
});

// GET request to find a city by name
router.get("/:name", async (req, res) => {
    const cityName = req.params.name;
    const city = await cityRepo.findCity(cityName);
    if (city) {
        res.json(city);
    } else {
        res.status(404).send("City not found");
    }
});

// PUT request to update a city
router.put("/:name", async (req, res) => {
    const cityName = req.params.name;
    const cityData = req.body;
    try {
        const updatedCity = await cityRepo.updateCity(cityName, cityData);
        if (updatedCity) {
            res.json(updatedCity);
        } else {
            res.status(404).send("City not found");
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// DELETE request to delete a city
router.delete("/:name", async (req, res) => {
    const cityName = req.params.name;
    try {
        const deletedCity = await cityRepo.deleteCity(cityName);
        if (deletedCity) {
            res.send("City deleted successfully");
        } else {
            res.status(404).send("City not found");
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
});

module.exports = router;