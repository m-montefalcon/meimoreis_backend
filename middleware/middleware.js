import dotenv from "dotenv";
import { verifyJwtToken } from "../utils/token.js";

dotenv.config();

const authenticateToken = (req, res, next) => {
    // Retrieve the JWT token from the cookie
    const token = req.cookies['jwtToken'];

    if (!token) return res.sendStatus(401);

    // Verify the JWT token
    verifyJwtToken(token, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

export { authenticateToken };
