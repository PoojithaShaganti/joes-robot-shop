const mongoose = require('mongoose');

// Define the product schema
const productSchema = new mongoose.Schema({
  id: Number,
  name: String,
  description: String,
  imageName: String,
  category: String,
  price: Number,
  discount: Number,
});

// Create and export the Product model
module.exports = mongoose.model('Product', productSchema);