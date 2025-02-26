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
  stockQuantity: {
    type: Number,
    required: true,
    min: 0,
  },
  basePrice: {
    type: Number,
    required: true,
    min: 0,
  },
  category: { 
    type: String, 
    required: true,
    enum: ['Footwear', 'Sportswear', 'Smartphone', "Men's Wear", "Women's Wear"], 
  },
  subcategory: { 
    type: String, 
    required: true,
    enum: [
      'Sneakers', 'Shoes', 'Boots', 'Slippers',  // Footwear
      'Pants', 'Spandex', 'Sports Bra',          // Sportswear
      'Android', 'iPhone', 'Accessories',        // Smartphone
      'Shirts', 'Trousers', 'Jackets',           // Men's Wear
      'Dresses', 'Tops', 'Skirts'                // Women's Wear
    ],
  },
  brand: {
    type: String,
    required: true, 
  },
  description: {
    type: String,
    trim: true,
  },
  price: { 
    type: Number, 
    required: true,
  },
});

const ProductModel = mongoose.model('Product', ProductSchema);
module.exports = ProductModel;
