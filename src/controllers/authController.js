/**
 * @file controllers/authController.js
 * @description HTTP handlers for authentication. Delegates business logic to
 * authServices and returns appropriate HTTP responses for register and login actions.
 */
const { registerUser, loginUser } = require('../services/authServices')
const register = async (req, res) => {
    try {
        const { email, password, name } = req.body;
        await registerUser(email, password, name); 
        return res.status(201).json({message: 'User registered succesfully'})
    } catch (error) {
        res.status(400).json({error: error.message})

    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body; 
        const token = await loginUser(email,password);
        return res.json({token});
    } catch (error) {
        return res.status(400).json({error: error.message});
    }
}; 

module.exports = { register, login};