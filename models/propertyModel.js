const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
    title: { type: String, required: true, unique: true },
    content: String,
    images: { 
      type: [String], // Array of strings to store image URLs
      required: true // Make the 'images' field required
    },
    city: String,
    area: String,
    locality: String,
    floor: Number,
    propertyType: {
      type: String,
      enum: ['house', 'apartment', 'plot', 'builderFloor', 'cooperativeSociety']
    },
    transactionType: {
      type: String,
      enum: ['leaseHold', 'freeHold']
    },
    option: {
      type: String,
      enum: ['sell', 'rent']
    },
    price: Number,
    areaSqft: Number,
    ownerName: { type: String, required: true, unique: true },
    contactNumber: { type: String, required: true, unique: true },
    facingDirection: {
      type: String,
      enum: ['north', 'south', 'east', 'west', 'other']
    },
    status: {
      type: String,
      enum: ['readyToMove', 'underConstruction']
    }
  }, { timestamps: true });
  
  module.exports = mongoose.model('Property', propertySchema);