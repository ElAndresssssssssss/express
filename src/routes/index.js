/**
 * @file routes/index.js
 * @description Root router. Aggregates all sub-routers and mounts them under their
 * respective path prefixes (e.g. /auth).
 */
const { Router } = require('express');
const authRouter = require('./auth')
const adminRouter = require('./admin')
const reservations = require('./reservations')
const appointments = require('./appointments')

const router = Router(); 
require('dotenv').config();

router.use('/auth', authRouter);
router.use('/admin', adminRouter );
router.use('/reservations', reservations);
router.use('/users', appointments);

module.exports = router;