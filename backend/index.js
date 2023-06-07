const express = require("express");
const cors = require("cors");
const googleMapsRouter = require("./routes/googleMaps");
const geolocationRouter = require("./routes/geolocation");
const geonamesRouter = require("./routes/geonames");
const chatGPTRouter = require("./routes/chatgpt");

const app = express();
app.use(express.json());
app.use(cors({
    origin: "http://localhost:3000"
}));
app.use("/", chatGPTRouter);
app.use("/googleMaps", googleMapsRouter);
app.use("/geolocation", geolocationRouter);
app.use("/geonames", geonamesRouter);

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Server started on port ${port}`));


