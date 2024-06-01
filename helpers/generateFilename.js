

//Function that generates the file name  on the uploaded picture
const generateProfilePicFileExt = async (firstName, lastName) => {
      // Generate custom filename based on the specified format
      const currentDate = new Date();
      const formattedDate = currentDate.toISOString().slice(0, 10).replace(/-/g, ''); // Format: YYYYMMDD
      const formattedTime = currentDate.toTimeString().slice(0, 8).replace(/:/g, ''); // Format: HHMMSS
      const customFilename = `user-profile-${firstName}_${lastName}-${formattedDate}-${formattedTime}`;
      return customFilename;
}


//Function that generates the file name  of the post images
const generatePostPictureFileExt = async (post_id) => {
      // Generate custom filename based on the specified format
      const currentDate = new Date();
      const formattedDate = currentDate.toISOString().slice(0, 10).replace(/-/g, ''); // Format: YYYYMMDD
      const formattedTime = currentDate.toTimeString().slice(0, 8).replace(/:/g, ''); // Format: HHMMSS
      const customFilename = `posts-${post_id}${formattedDate}${formattedTime}`;
      return customFilename;
}

export {generateProfilePicFileExt, generatePostPictureFileExt}