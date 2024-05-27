import admin from "firebase-admin";

async function uploadFile(file, folderPath) {
    try {
        // Reference the storage bucket
        const bucketName = process.env.STORAGE_BUCKET;
        const bucket = admin.storage().bucket(bucketName);

        // Get a reference to the file location in Firebase Storage
        const storageFilePath = `${folderPath}/${file.originalname}`;
        const storageFile = bucket.file(storageFilePath);

        // Upload the file to Firebase Storage
        await storageFile.save(file.buffer);

        // Return the storage file path
        return storageFilePath;
    } catch (error) {
        console.error(error);
        throw new Error(`Error uploading file: ${error}`);
    }
}

export { uploadFile };
