const Product = require('../models/productModel');
const AWS = require('aws-sdk');
const path = require('path');
const dotenv = require('dotenv');
const fs = require('fs'); 
dotenv.config();

// Get all products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching products' });
  }
};

// Get product by ID
exports.getProductById = async (req, res) => {
  try {
    const id = req.params.id;
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching product' });
  }
};


const s3 = new AWS.S3({ apiVersion: '2006-03-01' });
exports.createProduct = async (req, res) => {
  try {
    const {
      productName,
      price,
      brand,
      seller,
      manufacturingDate,
      expiryDate,
      listingDate,
      discountedPrice,
      percentageOfDiscountOffered,
      quantity,
      category,
    } = req.body;

    const images = req.files;

    if (!images || images.length === 0) {
      return res.status(400).send({ message: 'At least one image is required.' });
    }

    const imageUrls = [];
    for (const image of images) {
      // Read the file from the disk
      const fileContent = fs.readFileSync(image.path); 

      const s3Params = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: `products/${Date.now()}-${image.originalname}`,
        Body: fileContent, // Now we use fileContent
        ContentType: image.mimetype,
      };

      const uploadedImage = await s3.upload(s3Params).promise();
      imageUrls.push(uploadedImage.Location);
    }

    const product = new Product({
      productName,
      images: imageUrls,
      price,
      brand,
      seller,
      manufacturingDate,
      expiryDate,
      listingDate,
      discountedPrice,
      percentageOfDiscountOffered,
      quantity,
      category,

    });

    await product.save();
    res.status(201).send(product);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).send({ message: 'Error creating product', error });
  }
};

// Update a product
exports.updateProduct = async (req, res) => {
  try {
    const id = req.params.id;
    await Product.findByIdAndUpdate(id, req.body, { new: true });
    res.json({ message: 'Product updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating product' });
  }
};

// Delete a product
exports.deleteProduct = async (req, res) => {
  try {
    const id = req.params.id;
    await Product.findByIdAndRemove(id);
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting product' });
  }
};



