const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  productName: String,
  images: { // Change field name to 'images' 
    type: [String], // Array of strings to store image URLs
    required: true 
  },
  price: Number,
  category: String,
  brand: String,
  seller: String,
  manufacturingDate: Date,
  expiryDate: Date,
  listingDate: Date,
  discountedPrice: Number,
  percentageOfDiscountOffered: Number,
  quantity: Number,
});

module.exports = mongoose.model('Product', productSchema);