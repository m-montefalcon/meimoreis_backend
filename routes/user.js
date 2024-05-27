import express from "express";
import multer from "multer";
import dotenv from "dotenv";
import admin from "firebase-admin";
import { getServiceAccountKey } from "../utils/getFirebaseServiceAccount.js";

dotenv.config();
const router = express.Router();
const upload = multer();

(async () => {
    try {
        const serviceAccount = await getServiceAccountKey();
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
            storageBucket: `${process.env.STORAGE_BUCKET}.appspot.com`
        });
        console.log('Firebase Admin initialized successfully');
    } catch (error) {
        console.error('Initialization failed:', error);
    }
})();

// Check if Firebase Admin SDK has been initialized
if (!admin.apps.length) {
    console.error('Firebase Admin SDK has not been initialized');
}

router.post('/upload', upload.single('image'), async (req, res) => {
    try {
        // Reference the storage service
        const st = admin.storage();

        // Reference the storage bucket
        const bucket = st.bucket(process.env.STORAGE_BUCKET);

        // Specify the folder name
        const projectDirectory = (process.env.PROJECT_DIRECTORY);
        const profile = (process.env.USER_PROFILE_DIRECTORY);

        // Generate a unique name for the uploaded file
        const fileName = req.file.originalname;

        // Get a reference to the file location in Firebase Storage
        const file = bucket.file(`${projectDirectory}/${profile}/${fileName}`);

        // Upload the file to Firebase Storage
        await file.save(req.file.buffer);

        // Return success response
        res.status(200).send(`File ${fileName} uploaded successfully.`);
    } catch (error) {
        console.error(error);
        res.status(500).send(`Error uploading file: ${error}`);
    }
});

router.post('/register', upload.single(), (req, res) => {
    // No need to set CORS headers here, they should be set globally

    // Access the parsed request body data
    const requestBodyData = req.body;
    console.log(requestBodyData)
    res.send(requestBodyData).status(200); // Send a 200 OK response with the request body data
});

export default router;
