const express = require("express");
const cors = require("cors");
const googleMapsRouter = require("./routes/googleMaps");
const translateRouter = require("./routes/translate");
//const geolocationRouter = require("./routes/geolocation");
const geonamesRouter = require("./routes/geonames");
const chatGPTRouter = require("./routes/chatgpt");
const googleNLRouter = require("./routes/googleNL");
const openStreetMapRouter = require("./routes/openStreetMap");
const googleSheetsRouter = require("./routes/googleSheets");
//const { loadNLPModel, nlpRouter } = require("./routes/nlp");

const app = express();
app.use(express.json());
app.use(cors( { origin: "http://localhost:3000" } ));

app.use("/gpt", chatGPTRouter);
app.use("/googleMaps", googleMapsRouter);
app.use("/translate", translateRouter);
app.use("/openStreetMap", openStreetMapRouter);
//app.use("/geolocation", geolocationRouter);
app.use("/geonames", geonamesRouter);
app.use("/googleSheets", googleSheetsRouter);
app.use("/googleNL", googleNLRouter);

const port = process.env.PORT || 8080;
app.listen(port, () => {
    //loadNLPModel();
    console.log(`Server started on port ${port}`)
});


