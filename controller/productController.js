const ProductModel = require("../model/Productmodel")
const cloudinary = require('../helper/cloudinary')
const fs = require('fs');

exports.createProduct = async (req,res) =>{
    try {
        const { productName,
            basePrice,
            brand,
            description,
            price,
            stockQuantity,
            category,
            subcategory} =req.body
            
            const uploadImage = await cloudinary.uploader.upload(req.file.path,(error)=>{
                if(error){
                    return res.status(400).json({
                        message:"this can`t be upload"+error.message
                    })
                }
            })
            const data = {
                productName,
                productImageUrl:uploadImage.secure_url,
                productImageId: uploadImage.public_id,
            basePrice,
            stockQuantity,
            brand,
            description,
            price,
            category,
            subcategory 
            };
            //console.log(data)
            fs.unlink(req.file.path, (error)=>{
                if(error){
                    console.log(error.message)
                }else{
                    console.log("File Removed Successfully")
                }
            })
            const newProduct = await ProductModel.create(data);
    
            return res.status(201).json({
                message: "New Product Created Successfully",
                data: newProduct
            })

        } catch (error) {
         res.status(500).json({
            message: error.message
         })   
        }
    }
exports.getallproduct = async (req,res) =>{
    try {
        const findallproduct = await ProductModel.find()
        res.status(200).json({
            message:"All Product in Database",
            data:findallproduct
        })
    } catch (error) {
        res.status(500).json({
           message:error.message 
        })
    }
}

exports.changeDP = async (req, res) =>{
    try{
        const {id} = req.params;
        const changeImage = await ProductModel.findById(id);
 
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
    const updatedImage = await ProductModel.findByIdAndUpdate(
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

//         const delImage = await cloudinary.uploader.destroy(findProduct.productImageId, (error)=>{
//             if(error){
//                 return res.status(404).json({
//                     message: error.message
//                 })
//             }
//         })

//         fs.unlink(req.file.path, (err)=>{
//             if(err){
//                 console.log(err.message)
//             }else{
//                 console.log("Previous File Removed Successfully")
//             }
//         })

//         const updateImage = await ProductModel.findByIdAndUpdate(id, newPhoto, {new: true})
//         return res.status(200).json({
//             message: "Image Successfully Updated"
//         })
//     }catch(error){
//         res.status(500).json({
//             message: "Internal Server Error" + error.message,

//         })
//     }
// }

exports.getOneProduct = async (req,res)=>{
    try {
        const {id} = req.params
        const findProduct = await ProductModel.findById(id)
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
        const updatedProduct = await ProductModel.findByIdAndUpdate(id, req.body, { new: true });
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
        const delproduct = await ProductModel.findById(id);
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
