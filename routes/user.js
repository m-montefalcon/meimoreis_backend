import express from "express";
import multer from "multer";
import dotenv from "dotenv";
import admin from "firebase-admin";
import { initializeFirebase } from "../config/firebase.js";
import { uploadFile } from "../helpers/firebaseStorageFileUpload.js";
import db from "../config/db.js";
dotenv.config();
const router = express.Router();
const upload = multer();

// Initialize Firebase
initializeFirebase();

// // Check if Firebase Admin SDK has been initialized
// if (!admin.apps.length) {
//     console.error('Firebase Admin SDK has not been initialized');
// }

router.post('/upload', upload.single('image'), async (req, res) => {
    try {
        // Specify the folder path
        const projectDirectory = process.env.PROJECT_DIRECTORY;
        const profile = process.env.USER_PROFILE_DIRECTORY;
        const folderPath = `${projectDirectory}/${profile}`;

        // Upload the file
        const storageFilePath = await uploadFile(req.file, folderPath);

        // Return success response
        res.status(200).send(`File ${storageFilePath} uploaded successfully.`);
    } catch (error) {
        console.error(error);
        res.status(500).send(error.message || 'Internal Server Error');
    }
});

router.post('/register', upload.single('image'), async (req, res) => {
    try {
        
        const requestBodyData = req.body;
        const valuesBody = {
            fname : requestBodyData.firstName,
            lname : requestBodyData.lastName,
            email : requestBodyData.email,
            profilePicture : "test",
            password : requestBodyData.password
        };
        try {
            const result = db.query("INSERT INTO users (f_name, l_name, email, profile_picture, password) VALUES ($1, $2, $3, $4, $5)", 
            [valuesBody.fname, valuesBody.lname, valuesBody.email, valuesBody.profilePicture, valuesBody.password]);
        } catch (error) {
            
        }

        console.log(requestBodyData);
        res.status(200).send(requestBodyData); // Send a 200 OK response with the request body data
    } catch (error) {
        console.error(error);
        res.status(500).send(error.message || 'Internal Server Error');
    }
});

export default router;
