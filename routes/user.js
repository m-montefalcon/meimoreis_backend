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


dotenv.config();
const router = express.Router();
const upload = multer();

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
        // Destructure email and password from request body
        const { email, password } = req.body;

        // Check if email and password are defined
        if (!email ||!password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }
        const user = await authenticateUser(email, password, res);
        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }
        // Generate JWT token
        const token = generateJwtToken(user);

        // Send token in response
        return res.status(200).json({ token: token });
       
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }

});

// Protected route example
router.get('/protected', authenticateToken, (req, res) => {
    res.status(200).json({ message: 'Protected route accessed', user: req.user });
});


export default router;
