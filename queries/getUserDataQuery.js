// Import database connection
import db from "../config/db.js";

// Function to retrieve user data from the database based on email
const getUserDataQuery = async (email) => {
    try {
        const queryResult = await db.query("SELECT user_id, f_name, l_name, email, profile_picture  FROM users WHERE email = $1", [email]);
        
        // Check if user with the provided email exists
        if (queryResult.rows.length === 0) {
            return null; // Return null if user doesn't exist
        }    

        const userData = {
            id : queryResult.rows[0].user_id,
            fName: queryResult.rows[0].f_name,
            lName: queryResult.rows[0].l_name,
            email: queryResult.rows[0].email,
            profilePicture: queryResult.rows[0].profile_picture
        };

        return userData;
    } catch (error) {
        console.error("Error retrieving user data:", error);
        throw error; 
    }
}

export { getUserDataQuery };
