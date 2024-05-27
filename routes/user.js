import express, { request } from "express";
import morgan from "morgan";
import multer from "multer"; // Import multer middleware
const router = express.Router();

// Set up multer middleware to handle multipart/form-data
const upload = multer();

router.post('/register', upload.single(), (req, res) => {
    // No need to set CORS headers here, they should be set globally

    // Access the parsed request body data
    const requestBodyData = req.body;
    console.log(requestBodyData)
    res.send(requestBodyData).status(200); // Send a 200 OK response with the request body data
});

export default router;
