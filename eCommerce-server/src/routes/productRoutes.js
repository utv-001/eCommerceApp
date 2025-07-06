import express from 'express'
import { requireSignIn, isAdmin } from '../middleware/authMiddleware.js'
import {
    createProductController,
    getProductController,
    getSingleProductController,
    productPhotoController,
    deleteProductController,
    updateProductController,
    productFilterController,
    productCountController,
    productListController,
    searchProductController,
    relatedProductController,
    productCategoryController,
    braintreeTokenController,
    braintreePaymentController
} from '../controllers/productController.js'
import formidable from 'express-formidable'

const productRouter = express.Router()

//routes

//create product
productRouter.post("/create-product", requireSignIn, isAdmin, formidable(), createProductController)

//update product
productRouter.put("/update-product/:pid", requireSignIn, isAdmin, formidable(), updateProductController)

//get all products
productRouter.get('/get-product', getProductController)

//get single product
productRouter.get('/get-product/:slug', getSingleProductController)

//get product photo
productRouter.get('/product-photo/:pid', productPhotoController)

//delete product
productRouter.delete('/delete-product/:pid', requireSignIn, isAdmin, deleteProductController)

//filter product
productRouter.post('/product-filters', productFilterController)

//product count
productRouter.get('/product-count', productCountController)

//product per page
productRouter.get('/product-list/:page', productListController)

//search product
productRouter.get('/search/:keyword', searchProductController)

//similar products
productRouter.get('/related-product/:pid/:cid', relatedProductController)

//category wise product
productRouter.get('/product-category/:slug', productCategoryController)

//payments routes
//token
productRouter.get('/braintree/token', braintreeTokenController)

//payments
productRouter.post('/braintree/payment', requireSignIn, braintreePaymentController)

export default productRouter