// API Configuration
// Copy this file to config.js and modify as needed for your environment

window.API_CONFIG = {
    // For local development without Docker: 'http://localhost:3000'
    // For Docker: 'http://localhost:3000'
    // For production: update with your production API URL
    BASE_URL: window.location.hostname === 'localhost' 
        ? 'http://localhost:3000' 
        : 'http://localhost:3000'
};

