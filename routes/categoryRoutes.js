const express = require('express');
const router = express.Router();
const CategoryController = require('../controller/categoryController');
const multer = require('multer'); // Import multer
const path = require('path'); 
const AWS = require('aws-sdk');
const dotenv = require('dotenv');
const fs = require('fs'); // Import the file system module
dotenv.config();

// Configure AWS S3
AWS.config.update({
  accessKeyId: process.env.S3_ACCESS_KEY, 
  secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  region: process.env.S3_REGION,
});


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/'); 
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname)); 
    },
  });
  
const upload = multer({ storage: storage });
  
const s3 = new AWS.S3({ apiVersion: '2006-03-01' });
router.get('/categories', CategoryController.getCategory);
router.post('/categories', upload.array('image', 6), CategoryController.createCategory);
router.put('/categories:id', CategoryController.updateCategory);
router.delete('/categories:id', CategoryController.deleteCategory);

module.exports = router;