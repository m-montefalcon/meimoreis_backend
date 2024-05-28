

import bcrypt from "bcrypt";
import db from "../config/db.js";
const authenticateUser = async (email, password, res) => {
    // Retrieve user data from the database based on the email
    const queryResult = await db.query("SELECT * FROM users WHERE email = $1", [email]);
    
    // Check if user with the provided email exists
    if (queryResult.rows.length === 0) {
        return res.status(401).json({ error: 'Invalid email or password' });
    }    

    // Extract the hashed password from the query result
    const hashedPassword = queryResult.rows[0].password;
    const userId = queryResult.rows[0].user_id;

    // Compare the provided password with the hashed password
    const passwordMatch = await bcrypt.compare(password, hashedPassword);


    // If passwords match, return user data
    if (passwordMatch) {
        return {id:userId, email:email};
    } else {
        return null;
    }
}

export {authenticateUser}