/**
 * @file server.js
 * @description Entry point of the application. Loads environment variables and starts
 * the HTTP server on the configured PORT (defaults to 3000).
 */
require('dotenv').config();
console.log("Database URL Check:", process.env.DATABASE_URL);

const app = require('./app')
const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log(`Executing server in https://localhost:${PORT}`)
}); 
