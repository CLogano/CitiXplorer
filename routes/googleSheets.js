const express = require("express");
const { google } = require("googleapis");
const { SecretManagerServiceClient } = require("@google-cloud/secret-manager");
const router = express.Router();

async function accessSecret() {
  const client = new SecretManagerServiceClient();
  const name = "projects/272546954098/secrets/Credentials/versions/latest";

  const [version] = await client.accessSecretVersion({name});

  const payload = version.payload.data.toString('utf8');

  const serviceAccountCredentials = JSON.parse(payload);

  return serviceAccountCredentials;
}


router.post("/contact", async (req, res) => {

    try {

        const { name, emailAddress, phoneNumber, zipcode, message } = req.body;
        console.log(name);

        const credentials = await accessSecret();

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
        console.error(error);
    }
});

module.exports = router;