// Import database connection
import db from "../../config/db.js";

// Function to retrieve user data from the database based on email
const postQuery = async (user_id, content, image) => {
    try {
        await db.query("INSERT INTO posts (user_id, content, image) VALUES ($1, $2, $3)",
         [user_id, content, image]);
         console.log("Post inserted successfully.");
         return true; // Return true indicating success

    } catch (error) {
        console.error("Error inserting query", error);
        throw error; 
    }
}

export { postQuery };
