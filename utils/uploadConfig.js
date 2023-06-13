require('dotenv').config();
const cloudinary = require('cloudinary').v2;

const multer = require('multer');

cloudinary.config({
  api_key: process.env.API_KEY,
  cloud_name: process.env.CLOUD_NAME,
  api_secret: process.env.API_SECRET,
});

const multerConfigs = {
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      // Store in the images directory
      return cb(null, 'images');
    },
    filename: (req, file, cb) => {
      // Add the time to the file name
      return cb(null, `${new Date().getTime()}-${file.originalname}`);
    },
  }),

  fileFilter: (req, file, cb) => {
    // Accept only images
    if (file.mimetype.includes('image')) {
      return cb(null, true);
    } else {
      return cb(null, false);
    }
  },
};

const uploader = multer(multerConfigs);

const uploadToCloud = async (path) => {
  const file = await cloudinary.uploader.upload(path, {
    folder: 'users-list',
  });

  return file.url;
};

module.exports = { uploader, uploadToCloud };
