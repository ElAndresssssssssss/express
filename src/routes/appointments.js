const { Router} = require('express'); 
const appointmentController = require('../controllers/appointmentController')
const router = Router();
const authenticateToken = require('../middleware/auth')


router.get('/:id/appointments', appointmentController.getUserAppointments);

module.exports = router;