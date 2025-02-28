const productModel = require("../model/productmodel")
const categoryModel = require("../model/categoryModel")
const cloudinary = require('../helper/cloudinary')
const fs = require('fs');


exports.createProduct = async (req,res) =>{
    try {
        const findCategory = await categoryModel.findById(req.params.id)

        if (!findCategory) {
            return res.status(404).json({ 
                message: 'Category not found' 
            })
        }
        const { productName, description, price } =req.body
            
            const uploadImage = await cloudinary.uploader.upload(req.file.path,(error)=>{
                if(error){
                    return res.status(400).json({
                        message:"this can`t be upload"+error.message
                    })
                }
            })
            const data = {
                productName,
                description,
                price,
                productImageUrl:uploadImage.secure_url,
                productImageId: uploadImage.public_id,
                category: findCategory._id,
            };
     
            fs.unlink(req.file.path, (error)=>{
                if(error){
                    console.log(error.message)
                }else{
                    console.log("File Removed Successfully")
                }
            })
            const newProduct = await productModel.create(data);
            const populatedProduct = await productModel.findById(newProduct._id).populate('category');

    
            return res.status(201).json({
                message:populatedProduct
            })

        } catch (error) {
         res.status(500).json({
            message: error.message
         })   
        }
    }
exports.getProductById = async (req,res) =>{
    try {
        const product = await productModel.find({}).populate('category', 'name');
        if (product) {
            res.status.json({
                product
            });
        } else {
            res.status(404).json({
                 message: 'Product not found' 
            });
        }
    } catch (error) {
        res.status(500).json({
           message:error.message 
        })
    }
}

exports.getProducts = async (req, res) =>{
    try{
        const product = await productModel.find({}).populate('category', 'name');
        if (product) {
            res.status(200).json({
                product
            });
        } else {
            res.status(404).json({
                 message: 'Product not found' 
            });
        }
    }catch(error){
        res.status.json({
            message: error.message
        })
    }
}

exports.changeDP = async (req, res) =>{
    try{
        const {id} = req.params;
        const changeImage = await productModel.findById(id);
 
        if(!changeImage){
            return res.status(404).json({
                message: "Product Not Found"
            })
        }

        //This gets the image file from Cloudinary via the file path
const cloudImage = await cloudinary.uploader.upload(req.file.path);  
    if(changeImage.cloudImage){
        await cloudinary.uploader.destroy(changeImage.cloudImage);
    }
    await fs.promises.unlink(req.file.path);
    const updatedImage = await productModel.findByIdAndUpdate(
        id,{
            productImagesUrl : cloudImage.secure_url, 
            productImageId: cloudImage.public_id,
        },
        {new: true }
    );
        return res.status(200).json({
            message: "Image successfully updated",
            data: updatedImage
        });
    }catch(error){
        if(req.file){
            await fs.promises.unlink(req.file.path).catch(console.error);
        }
    return res.status(500).json({
        message:error.message
    });
}  
};

exports.getOneProduct = async (req,res)=>{
    try {
        const {id} = req.params
        const findProduct = await productModel.findById(id)
        if(!findProduct){
            res.status(404).json({
                message:`Product not found`
            })
        }else{
            res.status(200).json({
                message:`Product found`,
                data: findProduct
            })
        }
    } catch(error) {
        res.status(500).json({
            message:error.message
        })
    }
}

exports.updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedProduct = await productModel.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedProduct) 
            return res.status(404).json({
         message: "Product not found"
         });
        res.status(200).json({
             message: "Product updated successfully", 
            data: updatedProduct
         });
    } catch (error) {
        res.status(500).json({ 
            message: error.message
         });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const delproduct = await productModel.findById(id);
        if (!delproduct)
             return res.status(404).json({
             message: "Product not found" });
        console.log(delproduct)
        await cloudinary.uploader.destroy(delproduct.productImageId);
        
        await ProductModel.findByIdAndDelete(id);
        
        res.status(200).json({ 
            message: "Product deleted successfully" });
    } catch (error) {
        res.status(500).json({
             message: error.message });
    }
};
