const CONSTANTS = {
    apiURL: process.env.NODE_ENV === "production" ? "" : "http://localhost:8080",
    frontendURL: process.env.NODE_ENV === "production" ? "" : "http://localhost:3000"
};

export default CONSTANTS;