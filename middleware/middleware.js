import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { verifyJwtToken } from "../utils/token.js";

dotenv.config();
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.sendStatus(401);

    // Remove the "Bearer " prefix if present
    const token = authHeader.split(' ')[1];

    verifyJwtToken(token, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};



export { authenticateToken };
