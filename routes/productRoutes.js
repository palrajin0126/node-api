const express = require('express');
const router = express.Router();
const productController = require('../controller/productController');
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

const s3 = new AWS.S3({ apiVersion: '2006-03-01' });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); 
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); 
  },
});

const upload = multer({ storage: storage });

router.get('/products', productController.getAllProducts);
router.get('/products/:id', productController.getProductById);

router.post('/products', upload.array('image', 6), productController.createProduct); 

router.put('/products/:id', productController.updateProduct);
router.delete('/products/:id', productController.deleteProduct);

module.exports = router;