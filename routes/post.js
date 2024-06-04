import express from "express";
const router = express.Router();
import { authenticateToken } from "../middleware/middleware.js";
import multer from "multer";
import { generatePostPictureFileExt } from "../helpers/generateFilename.js";
import { uploadFile } from "../helpers/firebaseStorageFileUpload.js";
import { generatePostPictureDirectory } from "../helpers/folder_paths/postPictureDirectory.js";
import { postQuery } from "../queries/posts/postQuery.js";
import { getQuery } from "../queries/posts/getQuery.js";
const upload = multer();


router.use(authenticateToken);

router.post('/', upload.single('contentImage'), async(req, res)=>{
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

router.get('/', async (req, res) => {
    try {
        const posts = await getQuery(); // Fetch posts using the getQuery function
        res.json(posts); // Send the fetched posts as JSON response
    } catch (error) {
        console.error("Error fetching posts:", error);
        res.status(500).json({ message: "Internal Server Error" }); // Send a generic error message with a 500 status code
    }
});





export default router;