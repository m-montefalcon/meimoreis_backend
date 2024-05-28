import admin from "firebase-admin";

const uploadFile = async (file, folderPath) => {
    try {
        // Reference the storage bucket
        const bucketName = process.env.STORAGE_BUCKET;
        const bucket = admin.storage().bucket(bucketName);

        // Generate the desired new file name including the extension
        const newFileName = `${folderPath}/${file.originalname}`;

        // Create a blob from the file buffer
        const blob = bucket.file(newFileName);

        // Set the content type based on the original file type
        const contentType = file.mimetype; // Get the MIME type of the file
        const metadata = {
            contentType: contentType,
        };

        // Rename the file in Firebase Storage
        await blob.createWriteStream({
            metadata: metadata,
            // Specify the destination file name here
            destination: newFileName,
        }).on('finish', () => {
            console.log('Upload finished.');
        }).end(file.buffer);
        
    } catch (error) {
        console.error(error);
        throw new Error(`Error uploading file: ${error}`);
    }
};

export {uploadFile};
