import express from "express";
const router = express.Router();
import { authenticateToken } from "../middleware/middleware.js";
import multer from "multer";
import { generatePostPictureFileExt } from "../helpers/generateFilename.js";
import { uploadFile } from "../helpers/firebaseStorageFileUpload.js";
import { generatePostPictureDirectory } from "../helpers/folder_paths/postPictureDirectory.js";
import { postQuery } from "../queries/posts/postQuery.js";
const upload = multer();

router.post('/', upload.single('contentImage'), authenticateToken, async(req, res)=>{
    const { userId, content} = req.body;
    console.log(req.body);
    if (!userId ||!content) {
        return res.status(400).json({ error: 'All field must have values' });
    }
    try {
        const path = await generatePostPictureDirectory();
        const image_url = await generatePostPictureFileExt(userId);
    
        // Change the original name of the file
        const modifiedFile = req.file;
        modifiedFile.originalname = image_url; // Change the originalname property
        
        const storageFilePath = await uploadFile(modifiedFile, path);
        const query = await postQuery(userId, content, image_url); 
        if(!query) {
            res.status(500).send({error: "Error inserting data"});
        }
        
        res.status(200).send({ message: 'Success' });
        
    } catch (error) {
        console.error(error);
        res.status(500).send(error.message);
    }
   
});




export default router;