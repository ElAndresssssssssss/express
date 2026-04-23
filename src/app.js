/**
 * @file app.js
 * @description Express application setup. Registers JSON body parsing, mounts all API
 * routes under /api, and exposes a root health-check endpoint.
 */
const logger = require('./middleware/logger')
const error = require('./middleware/errorHandler')
const express = require('express');
const path = require('path');
const routes  = require('./routes')
require('dotenv').config();
const app = express();


app.use(express.json()); //It parses incoming requests with JSON payloads and makes the data available in:
app.use(logger);

app.use('/api', routes); //it says that this one is going to be the main point
app.use(express.static(path.join(__dirname, '..', 'frontend')));
app.use(error);


module.exports = app;