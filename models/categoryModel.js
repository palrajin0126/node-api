const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  categoryName: String,
  images: { // Change field name to 'images' 
    type: [String], // Array of strings to store image URLs
    required: true 
  },
  date_of_listing: Date,
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Category', categorySchema);