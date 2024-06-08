import express from "express";
import {postQuery} from "../queries/likes/postQuery.js"
import db from "../config/db.js";
import { authenticateToken } from "../middleware/middleware.js";

const router = express.Router();

router.use(authenticateToken)



router.post('/', async (req, res) => {
    const { userId, postId } = req.body;
    if (!userId || !postId) {
        return res.status(400).json({ error: 'All fields must have values' });
    }
    try {
        const result = await postQuery(postId, userId);
        if (!result) {
            return res.status(400).json({ error: 'Error inserting query' });
        }
        res.status(200).json({ Message: 'Success!' });
    } catch (error) {
        console.error("Error inserting query", error);
        res.status(400).json({ error: 'An error occurred while inserting query' });
    }
});


export default router;
