import express from 'express'
import {requireSignIn, isAdmin} from '../middleware/authMiddleware.js'
import { createCategoryController, updateCategoryController, getAllCategoriesController, getSingleCategoryController, deleteCategoryController } from '../controllers/categoryController.js'

const categoryRouter = express.Router()

//routes

//create category
categoryRouter.post('/create-category', requireSignIn, isAdmin, createCategoryController)

//update category
categoryRouter.put('/update-category/:id', requireSignIn, isAdmin, updateCategoryController)

//get all category
categoryRouter.get('/all-categories', getAllCategoriesController)

//get single category
categoryRouter.get('/single-category/:slug', getSingleCategoryController)

//delete category
categoryRouter.delete('/delete-category/:id', requireSignIn, isAdmin, deleteCategoryController)

export default categoryRouter