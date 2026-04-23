/**
 * @file app.js
 * @description Express application setup. Registers JSON body parsing, mounts all API
 * routes under /api, and exposes a root health-check endpoint.
 */
const logger = require('./middleware/logger')
const error = require('./middleware/errorHandler')
const express = require('express');
const routes  = require('./routes')
require('dotenv').config();
const app = express();


app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') return res.sendStatus(200);
    next();
});
app.use(express.json()); //It parses incoming requests with JSON payloads and makes the data available in:
app.use(logger);

app.use('/api', routes); //it says that this one is going to be the main point 
app.get('/', (req, res) => {
    res.send('Hello world')
});
app.use(error);


module.exports = app;