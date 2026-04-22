/**
 * @file routes/auth.js
 * @description Authentication routes. Exposes POST /register, POST /login, and a
 * JWT-protected GET /protected-route endpoint.
 */
const { Router } = require('express'); //like a route handler inside express that lets us organize server endpoints
const { register, login} = require('../controllers/authController'); 
const authenticatetoken = require ('../middleware/auth') 

const router = Router();

router.post('/register', register);
router.post('/login', login);

router.get('/protected-route', authenticatetoken, (req, res) => {
    res.send('This is a protected route');
});

module.exports = router;