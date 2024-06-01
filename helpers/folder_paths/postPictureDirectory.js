import dotenv from "dotenv"

const generatePostPictureDirectory = () => {
    const projectDirectory = process.env.PROJECT_DIRECTORY;
    const profile = process.env.POST_PICTURE_DIRECTORY;
    const folderPath = `${projectDirectory}/${profile}`;
    return folderPath;
}


export {generatePostPictureDirectory};