// Import database connection
import db from "../../config/db.js";

// Function to retrieve user data from the database based on email
const getQuery = async () => {
    try {
        // Execute the SQL query
        const result = await db.query("SELECT u.user_id, u.f_name, u.l_name, u.profile_picture, p.post_id, p.content, p.image, p.timestamp FROM users u INNER JOIN posts p ON u.user_id = p.user_id");

        return result.rows; // Adjust according to your database library if needed
    } catch (error) {
        console.error("Error executing query:", error);
        // Rethrow the error to allow calling functions to handle it further if necessary
        throw error;
    }
};

export { getQuery };
