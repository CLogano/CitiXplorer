# CitiXplorer
Application that recommends historical attractions to visit in any city around the world.

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).



## Information about the project

This app is designed to generate up to 10 historical attractions for any inputted city by the user.
Each attraction contains pictures, ratings, user reviews and other relevant data from Google Maps, and is enhanced with unique descriptions created by ChatGPT.
Each attraction has a short description, and an optional lengthy one which goes into detail about the history of the place, areas of interest in the vicinity, and reasons for visiting.
Attractions are displayed on a Google map. Users can interact with each attraction through a list on the left side of the screen or through custom markers on the map.
Users can also learn more about the city through the "City" tab on the far left of the screen, which shows a summary of the city's history (generated by ChatGPT) along with accompanying pictures.

I came up with the idea for this app while studying abroad in France in my junior year of college. My friends and I frequently traveled on weekends, and we would have a hard time deciding on places to go to in each city we visited.
I enjoy learning about the history and culture of different cities, so I thought this app would be a great idea!



## Steps to run the application

**Note: This project contains many APIs, of which some are not free. Proceed at your own caution!**

1. Install [node.js](https://nodejs.org/en/download). This application utilizes version `18.15.0`.

2. Make sure git is properly installed and clone the project in the target directory.
   
3. Install `node_modules` in `/backend` and `/frontend` by running the command `npm install` in each respective folder.
   
4. Create a `.env` file in `/backend` and `/frontend` to store API keys and other sensitive information.
   
5. Obtain the necessary API keys, etc. by following the steps at the bottom of the page and paste them into the `.env` files (see each `.env_sample` as a reference). Replace the placeholder text on the right hand side with the key wrapped in `""`. For example, `GOOGLE_API_KEY="aDFsIMnP3dtJuN0w"`.
   
6. In two seperate terminals, navigate to `/frontend` in one and `/backend` in the other.
    
7. In `/backend`, run the command `npm run dev`.
   
8. In `/frontend`, run the command `npm start`.

You should be good to go!



##  API keys and other secure info

### Google

Used to generate attractions and obtain the relevant data about them.

1. Create a new project on [Google Cloud Platform](https://console.cloud.google.com/).
2. Enable billing on your account if needed (Free credit is offered as well).
3. Go to the main dashboard.
4. Navigate to **APIs & Services** &rarr; **Enabled APIs & services**.
5. Click on **ENABLE APIS AND SERVICES** at the top of the screen.
6. Enable the **following APIs**:
   - **Places API**
   - **Maps Javascript API**
   - **Geocoding API**
   - **Google Sheets API**
   - **reCAPTCHA Enterprise API**
7. Navigate to **Credentials**.
8. Click on **CREATE CREDENTIALS** at the top of the screen and choose **API key**.
9. Copy the key and paste into your `.env` file in `/backend` for `GOOGLE_API_KEY`. Optionally, name the key "backend key" or something along those lines in the Cloud Console.
10. Repeat steps 8-9, but instead of pasting the key in `/backend`, replace `REACT_APP_GOOGLE_API_KEY` in the `.env` file in `/frontend`. Name this one "frontend key" or similar in the Cloud Console.
    **Note:** If you end up deploying the app, it is heavily recommended to restrict the frontend key to your website domain or IP address to prevent it from being stolen.
11. Click on **CREATE CREDENTIALS** once more, and this time select **Service account**.
12. Give this account a name and an ID and hit **Create and Continue** &rarr; **Done**.
13. Click on your new service account, hit **Keys** &rarr; **ADD KEY** &rarr; **Create new key** &rarr; **JSON** &rarr; **CREATE**. This will download a JSON file with credentials associated with your service account.
14. Rename the JSON file to `credentials`.
15. Create a new folder in the same directory of the project's root folder (**NOT WITHIN**) called `CitiXplorer Credentials` and place `credentials` inside of it. This name must be **EXACT**.

### **Optional:** Setting up the Contact Form

**Note:** If you are planning on running this project only in development mode, you may skip steps 1-3.
1. Navigate to [Google reCAPTCHA Enteprise](https://www.google.com/recaptcha/about/). Create a new project and register the site.
2. Obtain both a secret key and site key for a v2 reCAPTCHA "I am not a robot" challenge type.
3. Replace `GOOGLE_CAPTCHA_SECRET_KEY` with the secret key in the `.env` file in `/backend`, and `REACT_APP_GOOGLE_CAPTCHA_SITE_KEY` with the site key in the `.env` file on `/frontend`.
4. Navigate to [Google Sheets](https://www.google.com/sheets/about/) and create a new sheet. This is where the data from the contact form will be stored.
5. Rename `Sheet1` to `Contact Form Responses`. This name must be **EXACT**.
6. Copy the spreadsheet ID which can be found in the url between `d/` and  `/edit`. Replace `GOOGLE_SHEETS_ID` in the `.env` file in `/backend` with this ID.
7. Share the spreadsheet with the email address associated with your **Google Cloud Platform Service Account**. This will allow the Google Sheets API to write to the sheet.
8. In your sheet, navigate to **Extensions** &rarr; **Apps Script**.
9. Copy and paste the code from `appsscript.js` which is found in `/backend`.
10. Navigate to **Project Settings** on the left, and enable **Show "appsscript.json" manifest file in editor**.
11. Go back to the editor, click on **appsscript.json** and paste the code from `appsscript.json` which is found in `/backend`.
12. Select the `CreateTimeDrivenTrigger` function at the top and hit `Run`. Now the form will be checked every 5 minutes to see if a response has been recorded, and will send an automated reply if so.

### OpenAI

Used to create unique descriptions about each attraction and the city.

1. Navigate to the [OpenAI Platform](https://platform.openai.com/overview). Create an account if you have not done so.
2. Enable billing on your account if needed (Free credit is offered as well).
3. In the top right corner, click on **Personal** &rarr; **View API keys**.
4. Generate a new API key and replace `OPEN_AI_API_KEY` with it in the `.env` file on `/backend`.

### Geonames

Used to obtain access to registered city names throughout the world.

1. Navigate to [GeoNames](http://www.geonames.org/). Create an account if you have not done so.
2. Login to your account to access the webservices.
3. Replace `GEONAMES_USERNAME` in the `.env` file in `/backend` with your **geonames username**.
