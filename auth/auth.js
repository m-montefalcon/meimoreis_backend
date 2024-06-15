import bcrypt from "bcrypt";
import db from "../config/db.js";

const authenticateUser = async (email, password) => {
    try {
        // Retrieve user data from the database based on the email
        const queryResult = await db.query("SELECT * FROM users WHERE email = $1", [email]);

        // Check if user with the provided email exists
        if (queryResult.rows.length === 0) {
            return null; // Return null if user doesn't exist
        }

        // Extract the hashed password from the query result
        const hashedPassword = queryResult.rows[0].password;
        const userId = queryResult.rows[0].user_id;

        // Compare the provided password with the hashed password
        const passwordMatch = await bcrypt.compare(password, hashedPassword);

        // If passwords match, return user data
        if (passwordMatch) {
            return { id: userId, email: email };
        } else {
            return null; // Return null if passwords don't match
        }
    } catch (error) {
        console.error("Error authenticating user:", error);
        throw error; // Throw the error to be caught by the caller
    }
}

export { authenticateUser };
