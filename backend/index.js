const express = require("express");
const cors = require("cors");
const googleMapsRouter = require("./routes/googleMaps");
const googleSheetsRouter = require("./routes/googleSheets");
const geonamesRouter = require("./routes/geonames");
const chatGPTRouter = require("./routes/chatgpt");
const path = require("path");

const app = express();
app.use(express.json());
app.use(cors({ origin: "http://localhost:3000" }));
app.use("/gpt", chatGPTRouter);
app.use("/googleMaps", googleMapsRouter);
app.use("/geonames", geonamesRouter);
app.use("/googleSheets", googleSheetsRouter);

// Serve static files from the React app in production
if (process.env.NODE_ENV === "production") {
  // Serve any static files
  app.use(cors());
  app.use(express.static(path.join(__dirname, "../frontend/build")));

  // Handle React routing, return all requests to React app
  app.get("*", function (req, res) {
    res.sendFile(
      path.join(__dirname, "../frontend/build/index.html"),
      function (error) {
        if (error) {
          res.status(500).send(error);
        }
      }
    );
  });
}

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server started on port ${port}`)
});


