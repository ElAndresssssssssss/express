/**
 * @file services/authServices.js
 * @description Business logic for authentication. Handles user creation with bcrypt
 * password hashing (registerUser) and credential validation with JWT token generation (loginUser).
 */

require('dotenv').config()

const {PrismaClient} = require ('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs') //we had to download it 
const jwt = require('jsonwebtoken') //we had to download it 

const registerUser = async (email, password, name) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
        data: {email, password: hashedPassword, name, role: 'USER' }
    }); 
    return newUser;
}

const loginUser = async (email, password) => {
    const user = await prisma.user.findUnique({where: { email }});
    if (!user) {
        throw new Error('Invalid email or password')
    }
    const validPassword = await bcrypt.compare(password, user.password);
    if(!validPassword){
        throw new Error ('invalid email or password')
    }
    const token = jwt.sign(
        {id: user.id, role: user.role},
        process.env.JWT_SECRET,
        {expiresIn: '4h'}
    )
    return token;
}

module.exports = {registerUser, loginUser};