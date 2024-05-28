import dotenv from "dotenv"

const generateProfilePictureDirectory = () => {
    const projectDirectory = process.env.PROJECT_DIRECTORY;
    const profile = process.env.USER_PROFILE_DIRECTORY;
    const folderPath = `${projectDirectory}/${profile}`;
    return folderPath;
}


export {generateProfilePictureDirectory};