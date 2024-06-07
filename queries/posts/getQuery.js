// Import database connection
import db from "../../config/db.js";

// Function to retrieve user data from the database based on email
const getQuery = async () => {
    try {
        // Execute the SQL query
        const result = await db.query(`
            SELECT 
                COUNT(l.like_id) AS counts,
                ARRAY_AGG(l.user_id) AS user_ids,
                u.user_id, 
                u.f_name, 
                u.l_name, 
                u.profile_picture, 
                p.post_id, 
                p.content, 
                p.image, 
                p.timestamp
            FROM 
                posts p 
            INNER JOIN 
                users u ON u.user_id = p.user_id
            LEFT JOIN 
                likes l ON p.post_id = l.post_id
            GROUP BY
                u.user_id,
                p.post_id
            ORDER BY p.post_id ASC;
          `);
          
        return result.rows; 
    } catch (error) {
        console.error("Error executing query:", error);
        // Rethrow the error to allow calling functions to handle it further if necessary
        throw error;
    }
};

export { getQuery };
