const express = require("express");
const { google } = require("googleapis");
const fs = require("fs");
const path = require("path");
require("dotenv").config();
const router = express.Router();
require("dotenv").config();

router.post("/contact", async (req, res) => {

    try {

        const { name, emailAddress, phoneNumber, zipcode, message } = req.body;
        console.log(name);

        const credentialsPath = path.join(__dirname, '..', process.env.GOOGLE_APPLICATION_CREDENTIALS);
        const credentials = JSON.parse(fs.readFileSync(credentialsPath, "utf8"));


        const auth = new google.auth.JWT(
            credentials.client_email,
            null,
            credentials.private_key,
            ["https://www.googleapis.com/auth/spreadsheets"]
        );

          const sheets = google.sheets({ version: "v4", auth });
          const spreadsheetId = "1tm1HL9x-yj8S-FGuuszb9noiDbjxmo077qS9OQU1ES0"; //Change later

          await sheets.spreadsheets.values.append({
            spreadsheetId,
            range: "Contact Form Responses",
            valueInputOption: "RAW",
            insertDataOption: "INSERT_ROWS",
            resource: {
              values: [[name, emailAddress, phoneNumber, zipcode, message]],
            },
          });
      
          res.status(200).send({ message: "Data submitted successfully" });

    } catch (error) {
        res.status(500).send({ message: "There was a problem submitting the form!" });
        console.error(error);
    }
});

module.exports = router;