const express = require("express");
const router = express.Router();
const cityRepo = require("../repositories/cityRepository");

// POST request to add a new city
router.post("/", async (req, res) => {

    const cityData = req.body;

    try {
        const newCity = await cityRepo.createCity(cityData);
        res.json(newCity);
    } catch (error) {
        if (process.env.NODE_ENV !== "production") {
            console.error(error);
        }
        res.status(500).json({ error: "An error occurred" });
    }
    
});

// GET request to find a city by name
router.get("/:name", async (req, res) => {

    const cityName = req.params.name;

    try {
        const city = await cityRepo.findCity(cityName);
        res.json(city);
    } catch (error) {
        if (process.env.NODE_ENV !== "production") {
            console.error(error);
        }
        res.status(500).json({ error: "An error occurred" });
    }
});

// PUT request to update a city
router.put("/:name", async (req, res) => {

    const cityName = req.params.name;
    const cityData = req.body;

    try {
        const city = await cityRepo.updateCity(cityName, cityData);
        res.json(city);
    } catch (error) {
        if (process.env.NODE_ENV !== "production") {
            console.error(error);
        }
        res.status(500).json({ error: "An error occurred" });
    }
});

// DELETE request to delete a city
router.delete("/:name", async (req, res) => {

    const cityName = req.params.name;

    try {
        const city = await cityRepo.deleteCity(cityName);
        res.json(city);
    } catch (error) {
        if (process.env.NODE_ENV !== "production") {
            console.error(error);
        }
        res.status(500).json({ error: "An error occurred" });
    }
});

module.exports = router;