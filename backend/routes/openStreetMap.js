const express = require("express");
const router = express.Router();

router.get("/city-boundaries", async (req, res) => {

    const { city } = req.query;
    const overpassUrl = "http://overpass-api.de/api/interpreter";
    const overpassQuery = `
        [out:json];
        relation["name"="${city}"]["admin_level"="2"];
        out geom;`;

    try {
        const response = await fetch(overpassUrl, {
            method: "POST",
            body: overpassQuery,
        });
        const data = await response.json();

        console.log(data);
        
        
        // Find the largest polygon in the result.
        let maxArea = 0;
        let bestPolygon = null;
        for (let element of data.elements) {
            if (element.type === "way") {
                const polygon = element.geometry.map(({ lat, lon }) => [lon, lat]);
                polygon.push(polygon[0]);  // close the loop

                // Calculate the area of the polygon. 
                // This requires transforming the coordinates to a format 
                // that preserves area (like spherical coordinates), 
                // which is a complex task and beyond the scope of this example.
                // For simplicity, we just calculate the area in lat/lon coordinates,
                // which is not accurate but might be good enough for choosing the largest polygon.
                const area = Math.abs(turf.area(turf.polygon([polygon])));

                if (area > maxArea) {
                    maxArea = area;
                    bestPolygon = polygon;
                }
            }
        }

        res.json(bestPolygon);
    } catch (error) {
        console.error(`Error: ${error}`);
    }
});


module.exports = router;