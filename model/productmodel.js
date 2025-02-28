const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  productName: { 
    type: String, 
    required: true,
    trim: true,
    lowercase:true
  },
  productImageUrl: {
    type: String,
    required: true,
  },
  productImageId: {
    type: String,
  },
  description: {
    type: String,
    trim: true,
  },
  price: { 
    type: Number, 
    required: true,
  },
  category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
  },
});

const productModel = mongoose.model('Product', ProductSchema);
module.exports = productModel;