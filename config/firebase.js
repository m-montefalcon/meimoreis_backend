import admin from "firebase-admin";
import { getServiceAccountKey } from "../utils/getFirebaseServiceAccount.js";

async function initializeFirebase() {
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
}

export { initializeFirebase };
