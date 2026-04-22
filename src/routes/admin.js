const { Router } = require('express'); 
const { createTimeBlock, listReservations} = require('../controllers/adminController'); 
const authenticateToken = require('../middleware/auth')


const router = Router();

router.post('/time-blocks', authenticateToken, createTimeBlock);
router.get('/reservation', authenticateToken,listReservations); 

module.exports = router; 
