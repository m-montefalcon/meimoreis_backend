import express from "express";
import multer from "multer";
import dotenv from "dotenv";
import admin from "firebase-admin";
import { initializeFirebase } from "../config/firebase.js";
import { uploadFile } from "../helpers/firebaseStorageFileUpload.js";
import db from "../config/db.js";
import { generateProfilePicFileExt } from "../helpers/generateFilename.js";
import { generateProfilePictureDirectory } from "../helpers/folder_paths/profilePictureDirectory.js";
import { authenticateUser } from "../auth/auth.js";
import { authenticateToken } from "../middleware/middleware.js";
import { generateJwtToken } from "../utils/token.js";
import bcrypt from "bcrypt";
import { getUserDataQuery } from "../queries/getUserDataQuery.js";
import cookieParser from "cookie-parser";
dotenv.config();
const router = express.Router();
const upload = multer();
router.use(cookieParser());
// Initialize Firebase
initializeFirebase();

const saltRounds = 10; 
router.post('/register', upload.single('image'), async (req, res) => {
    try {
        //Deconstruction of request body
        const { firstName, lastName, email, password} = req.body;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        //Generate profile directory for firebase
        const path = await generateProfilePictureDirectory();

        //Generate image url for postgres and firebase storage
        const image_url = await generateProfilePicFileExt(firstName, lastName);

        // Change the original name of the file
        const modifiedFile = req.file;
        modifiedFile.originalname = image_url; // Change the originalname property

        // // Upload the file with the custom filename
        const storageFilePath = await uploadFile(modifiedFile, path);

        // Insert user data into the database
        await db.query("INSERT INTO users (f_name, l_name, email, profile_picture, password) VALUES ($1, $2, $3, $4, $5)", 
            [firstName, lastName, email, image_url, hashedPassword]);

        res.status(200).send({ message: 'Success' });
    } catch (error) {
        console.error(error);
        res.status(500).send(error.message || 'Internal Server Error');
    }
});


router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if email and password are provided
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        // Authenticate user
        const user = await authenticateUser(email, password);
        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Get user data
        const userData = await getUserDataQuery(email);
        if (!userData) {
            return res.status(401).json({ error: 'Invalid account' });
        }

        // Generate JWT token
        const token = generateJwtToken(user);

        // Set HTTP-only cookie with JWT token
        res.cookie('jwtToken', token, { httpOnly: true });

        // Send user data and token in response
        return res.status(200).json({ userData: userData });

    } catch (error) {
        throw error
    }
});



router.post('/logout', authenticateToken, (req, res)=>{
    try {
        // Clear the JWT cookie
        res.clearCookie('jwtToken', { httpOnly: true });
        res.status(200).send('Logged out successfully.');
    } catch (error) {
        console.error('Error clearing cookie:', error);
        res.status(500).send('Error logging out.');
    }
})


// Protected route example
router.get('/protected', authenticateToken, (req, res) => {
    res.status(200).json({ message: 'Protected route accessed', user: req.user });
});


export default router;
