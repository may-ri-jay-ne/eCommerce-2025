const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true
    },
    product:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'product'
     }]
})
const categoryModel = mongoose.model('category', categorySchema);

module.exports = categoryModel;
