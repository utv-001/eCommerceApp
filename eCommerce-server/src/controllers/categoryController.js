import categoryModel from "../models/categoryModel.js"
import slugify from "slugify"

export const createCategoryController = async (req, res)=>{
    try{
        const name = req.body.name
        if(!name){
            return res.status(401).send({message: "Name is required!"})
        }
        const existingCategory = await categoryModel.findOne({name})
        if(existingCategory){
            return res.status(200).send({
                success: true,
                message: "Category already exists",
                existingCategory
            })
        }
        const category = await new categoryModel({name, slug: slugify(name)})
        const categoryData = await category.save()
        return res.status(201).send({
            success: true,
            message: "New category created",
            categoryData
        })
    }catch(error){
        // console.log(error)
        return res.status(500).send({
            success: false,
            message:"Error in category",
            error
        })
    }
}

export const updateCategoryController = async (req, res)=>{
    try{
        const {name} = req.body
        const {id} = req.params
        const category = await categoryModel.findByIdAndUpdate(id, {name, slug: slugify(name)}, {new: true})
        return res.status(200).send({
            success: true,
            message: "Category updated successfully",
            category
        })
    }catch(error){
        // console.log(error)
        return res.status(500).send({
            success: false,
            message:"Error while updating category",
            error
        })
    }
}

export const getAllCategoriesController = async (req, res)=>{
    try{
        const category = await categoryModel.find()
        return res.status(200).send({
            success: true,
            message: "All categories list",
            category
        })
    }catch(error){
        // console.log(error)
        return res.status(500).send({
            success: false,
            message: "Error while getting all categories",
            error
        })
    }
}

export const getSingleCategoryController = async (req, res)=>{
    try{
        const category = await categoryModel.findOne({slug: req.params.slug})
        return res.status(200).send({
            success: true,
            message: "Category found successfully",
            category
        })
    }catch(error){
        // console.log(error)
        return res.status(500).send({
            success: false,
            message: "Unable to get category",
            error
        })
    }
}

export const deleteCategoryController = async (req, res)=>{
    try{
        const category = await categoryModel.findByIdAndDelete(req.params.id)
        return res.status(200).send({
            success: true,
            message: "Category deleted successfully"
        })
    }catch(error){
        // console.log(error)
        return res.status(500).send({
            success: false,
            message: "Error while deleting category",
            error
        })
    }
}