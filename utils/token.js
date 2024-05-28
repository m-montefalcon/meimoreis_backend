//This module serves to generate and verify JWT Tokens

import JWT from "jsonwebtoken"
import dotenv from "dotenv"

dotenv.config();

const secretKey = process.env.JWT_SECRET_KEY;
const generateJwtToken = (user) =>{
    return JWT.sign({ userId: user.user_id, userEmail : user.email }, secretKey, { expiresIn: '1h' });

};


const verifyJwtToken = (token, callback) => {
    try {
        console.log('Verifying token:', token); // Debug log
        const decoded = JWT.verify(token, secretKey);
        console.log('Decoded token:', decoded); // Debug log
        return callback(null, decoded);
    } catch (error) {
        console.error('Error verifying token:', error); // Debug log
        return callback(error, null);
    }
};




export {generateJwtToken, verifyJwtToken}