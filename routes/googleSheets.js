const express = require("express");
const { google } = require("googleapis");
const fetch = require("node-fetch");
require("dotenv").config();
const router = express.Router();
const path = require("path");
const secretKey = process.env.GOOGLE_CAPTCHA_SECRET_KEY;
const credentialsPath = path.resolve(__dirname, "..", "..", "CitiXplorer Credentials", "credentials.json");

let credentials;

if (process.env.NODE_ENV === "production") {
  // Load credentials from Heroku Secret Manager
  credentials = JSON.parse(Buffer.from(process.env.GOOGLE_APPLICATION_CREDENTIALS, "base64").toString("ascii"));
} else {
  // Load credentials from local .env file during development
  credentials = require(credentialsPath);
}

router.post("/contact", async (req, res) => {

    try {

        const { name, emailAddress, phoneNumber, zipcode, message, captchaValue } = req.body;
        console.log(name);

        if (process.env.NODE_ENV === "production") {
          // Validate the captcha first
          const response = await fetch("https://www.google.com/recaptcha/api/siteverify", {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body: `secret=${secretKey}&response=${captchaValue}`,
          });

          const data = await response.json();
          if (!data.success) {
            return res.status(400).json({ message: "Invalid captcha" });
          }
        }

        const auth = new google.auth.JWT(
            credentials.client_email,
            null,
            credentials.private_key,
            ["https://www.googleapis.com/auth/spreadsheets"]
        );

          const sheets = google.sheets({ version: "v4", auth });
          const spreadsheetId = "15rb0K8ppERPJSi-O4m30RAqcsrQdqRpNwLz3H-CSfUA";

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
        if (process.env.NODE_ENV !== "production") {
          console.error(error);
        }
    }
});

module.exports = router;