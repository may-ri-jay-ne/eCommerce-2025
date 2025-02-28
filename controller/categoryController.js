const categoryModel = require('../model/categoryModel');
const productModel = require('../model/productmodel');
exports.createCategory = async (req, res) => {
    try{
        const { name } = req.body;
        const categoryExists = await categoryModel.findOne({ name });
        if (categoryExists) {
            return res.status(400).json({ 
            message: 'Category already exists' 
        });
        }
        const category = await categoryModel.create({ name });
        res.status(201).json({
            message: "Category Created Successfully",
            data: category
        })

    }catch(error){
        res.status(500).json({
            message: error.message
        })
    }
}

exports.getCategory = async (req, res) =>{
    try{
        const category = await categoryModel.find()
        if(!category){
            return res.status(404).json({
                message: "Category Not Found"
            })
        }
        res.status(200).json({
            message: "All Categories",
            data: category
        });

    }catch(error){
        res.status(500).json({
            message: error.message
        })
    }
}

exports.updateCategory = async (req, res) =>{
    try{
        const { id } = req.params;
        const updatedCategory = await categoryModel.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedCategory) 
            return res.status(404).json({
         message: "Category not found"
         });
        res.status(200).json({
             message: "Category updated successfully", 
            data: updatedCategory
        })

    }catch(error){
        res.status(500).json({
            message: error.message
        })
    }
}
