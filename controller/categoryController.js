const Category = require('../models/categoryModel');
const AWS = require('aws-sdk');
const path = require('path');
const dotenv = require('dotenv');
const fs = require('fs');
dotenv.config();

exports.getCategory = async(req, res) => {
  try {
    const categories = await Category.find().sort({ timestamp: -1 });
    res.send(categories);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Error occurred while fetching categories' });
  }
}

const s3 = new AWS.S3({ apiVersion: '2006-03-01' });
exports.createCategory = async(req, res) => {
  try {
    const { categoryName} = req.body;
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
        Key: `categories/${Date.now()}-${image.originalname}`,
        Body: fileContent, // Now we use fileContent
        ContentType: image.mimetype,
      };

      const uploadedImage = await s3.upload(s3Params).promise();
      imageUrls.push(uploadedImage.Location);
    }
    const category = new Category({ categoryName, images: imageUrls });
    await category.save();
    res.status(201).send(category);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Error occurred while creating category' });
  }
}

exports.updateCategory = async(req, res) => {
  try {
    const categoryId = req.params.id;
    const { categoryName, image } = req.body;
    await Category.findByIdAndUpdate(categoryId, { categoryName, image }, { new: true });
    res.send({ message: 'Category updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Error occurred while updating category' });
  }
}

  exports.deleteCategory = async(req, res) => {
  try {
    const categoryId = req.params.id;
    await Category.findByIdAndRemove(categoryId);
    res.send({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Error occurred while deleting category' });
  }
}

