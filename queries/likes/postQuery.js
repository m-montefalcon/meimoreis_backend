// Import database connection
import db from "../../config/db.js";

const postQuery = async (postId, userId) => {
    try {
        await db.query("INSERT INTO likes (post_id, user_id) VALUES ($1, $2)", [postId, userId]);
        console.log("Like inserted successfully.");
        return true; // Return true indicating success
    } catch (error) {
        throw error;
    }
};

export { postQuery };
