import productModel from '../models/productModel.js'
import categoryModel from '../models/categoryModel.js'
import fs from 'fs'
import slugify from 'slugify'
import orderModel from '../models/orderModel.js'
import { config } from 'dotenv'
import braintree from 'braintree'
config()

// const braintree = await import('braintree')

//payment gateway
var gateway = new braintree.BraintreeGateway({
    environment: braintree.Environment.Sandbox,
    merchantId: process.env.BRAINTREE_MERCHANT_ID,
    publicKey: process.env.BRAINTREE_PUBLIC_KEY,
    privateKey: process.env.BRAINTREE_PRIVATE_KEY
});

export const createProductController = async (req, res) => {
    try {
        const { name, description, price, category, quantity, shipping } = req.fields
        const { photo } = req.files
        switch (true) {
            case !name:
                return res.status(500).send({ error: "Name is required" })
            case !description:
                return res.status(500).send({ error: "Description is required" })
            case !price:
                return res.status(500).send({ error: "Price is required" })
            case !category:
                return res.status(500).send({ error: "Category is required" })
            case !quantity:
                return res.status(500).send({ error: "Quantity is required" })
            case photo && photo.size > 1000000:
                return res.status(500).send({ error: 'Photo is required and should be less than 1MB' })
        }
        const products = new productModel({ ...req.fields, slug: slugify(name) })
        if (photo) {
            products.photo.data = fs.readFileSync(photo.path)
            products.photo.contentType = photo.type
        }
        await products.save()
        return res.status(201).send({
            success: true,
            message: "Product created successfully",
            products
        })
    } catch (error) {
        // console.log(error)
        return res.status(500).send({
            success: false,
            message: "Error in creating product",
            error
        })
    }
}

//get all products 
export const getProductController = async (req, res) => {
    try {
        const products = await productModel.find().populate('category').select("-photo").limit(15).sort({ createdAt: -1 })
        return res.status(200).send({
            success: true,
            message: "All products list",
            totalCount: products.length,
            products
        })
    } catch (error) {
        // console.log(error)
        return res.status(500).send({
            success: false,
            message: 'Error in getting products',
            error
        })
    }
}

//to get details of single product
export const getSingleProductController = async (req, res) => {
    try {
        const product = await productModel.findOne({ slug: req.params.slug }).select("-photo").populate('category')
        if (!product) {
            return res.status(400).send({
                success: false,
                message: "Product not found",
            })
        }
        return res.status(200).send({
            success: true,
            message: "Product fetched successfully",
            product
        })
    } catch (error) {
        //console.log(error)
        return res.status(500).send({
            success: false,
            message: "Error while getting product",
            error
        })
    }
}

//search product
export const searchProductController = async (req, res) => {
    try {
        const { keyword } = req.params
        const results = await productModel.find({
            $or: [
                { name: { $regex: keyword, $options: "i" } },
                { description: { $regex: keyword, $options: "i" } }
            ]
        }).select("-photo")
        res.json(results)
    } catch (error) {
        // console.log(error)
        return res.status(400).sned({
            success: false,
            message: "Error in search product API",
            error
        })
    }
}

//to get products based on pagination
export const productCountController = async (req, res) => {
    try {
        const total = await productModel.find({}).estimatedDocumentCount()
        res.status(200).send({
            success: true,
            total
        })
    } catch (error) {
        return res.status(400).send({
            success: false,
            message: "Error in product count",
            error
        })
    }
}

//get product by category
export const productCategoryController = async (req, res) => {
    try {
        const category = await categoryModel.findOne({ slug: req.params.slug })
        const products = await productModel.find({ category }).populate('category')
        return res.status(200).send({
            success: true,
            products,
            category,
        })
    } catch (error) {
        // console.log(error)
        return res.status(400).send({
            success: false,
            message: "Error while getting products by category",
            error
        })
    }
}

//filters
export const productFilterController = async (req, res) => {
    try {
        const { checked, radio } = req.body
        let args = {}
        if (checked?.length > 0) {
            args.category = checked
        }
        if (radio?.length) {
            args.price = { $gte: radio[0], $lte: radio[1] }
        }
        const products = await productModel.find(args)
        res.status(200).send({
            success: true,
            message: 'Products filtered successfully',
            products
        })
    } catch (error) {
        return res.status(400).send({
            success: false,
            message: "Error while filtering products",
            error
        })

    }
}

//product list based on page
export const productListController = async (req, res) => {
    try {
        const perPage = 6
        const page = req.params.page ? req.params.page : 1
        const products = await productModel.find({}).select("-photo").skip((page - 1) * perPage).limit(perPage).sort({ createdAt: -1 })
        return res.status(200).send({
            success: true,
            message: 'Products list based on page',
            products
        })
    } catch (error) {
        // console.log(error)
        return res.status(400).send({
            success: false,
            message: "Error in per page control",
            error
        })
    }
}

//similar products
export const relatedProductController = async (req, res) => {
    try {
        const { pid, cid } = req.params
        const products = await productModel.find({
            category: cid,
            _id: { $ne: pid },
        }).select("-photo").limit(3).populate('category')
        return res.status(200).send({
            success: true,
            message: "Similar products fetched successfully",
            products
        })
    } catch (error) {
        return res.status(400).send({
            success: false,
            message: "Error while getting similar products",
            error
        })
    }
}

//product photo
export const productPhotoController = async (req, res) => {
    try {
        const product = await productModel.findById(req.params.pid).select("photo")
        if (product.photo.data) {
            res.set("Content-type", product.photo.contentType)
            return res.status(200).send(product.photo.data)
        }
    } catch (error) {
        // console.log(error)
        return res.status(500).send({
            success: false,
            message: "Error while getting product photo",
            error
        })
    }
}

//delete product
export const deleteProductController = async (req, res) => {
    try {
        await productModel.findByIdAndDelete(req.params.pid).select("-photo")
        return res.status(200).send({
            success: true,
            message: "Product deleted successfully"
        })
    } catch (error) {
        // console.log(error)
        return res.status(500).send({
            success: false,
            message: "Error while deleting the product",
            error
        })
    }
}

//update product
export const updateProductController = async (req, res) => {
    try {
        const { name, description, price, category, quantity, shipping } = req.fields
        const { photo } = req.files
        //validation
        switch (true) {
            case !name:
                return res.status(500).send({ error: "Name is required" })
            case !description:
                return res.status(500).send({ error: "Description is required" })
            case !price:
                return res.status(500).send({ error: "Price is required" })
            case !category:
                return res.status(500).send({ error: "Category is required" })
            case !quantity:
                return res.status(500).send({ error: "Quantity is required" })
            case photo && photo.size > 1000000:
                return res.status(500).send({ error: 'Photo is required and should be less than 1MB' })
        }
        const products = await productModel.findByIdAndUpdate(req.params.pid, { ...req.fields, slug: slugify(name) }, { new: true })
        if (photo) {
            products.photo.data = fs.readFileSync(photo.path)
            products.photo.contentType = photo.type
        }
        await products.save()
        return res.status(201).send({
            success: true,
            message: "Product updated successfully",
            products
        })
    } catch (error) {
        // console.log(error)
        return res.status(500).send({
            success: false,
            message: "Error in updating product",
            error
        })
    }
}

//payment gateway api
//token
export const braintreeTokenController = async (req, res) => {
    try {
        gateway.clientToken.generate({}, function (err, response) {
            if (err) {
                res.status(500).send(err)
            } else {
                // console.log(response)
                res.send(response)
            }
        })
    } catch (error) {
        // console.log(error)
        res.status(500).send(err)
    }
}

//payment
export const braintreePaymentController = async (req, res) => {
    try {
        const { nonce, cart } = req.body
        // console.log(req.body)
        let total = 0
        cart.map((i) => { total += i.price })
        let newTransaction = gateway.transaction.sale(
            {
                amount: total,
                paymentMethodNonce: nonce,
                options: {
                    submitForSettlement: true,
                }
            },
            function (error, result) {
                if (result) {
                    const order = new orderModel({
                        products: cart,
                        payment: result,
                        buyer: req.user._id
                    }).save()
                    res.json({ ok: true })
                } else {
                    res.status(500).send(error)
                }
            }
        )
    } catch (error) {
        // console.log(error)
        res.status(500).send(error)
    }
}

// export const braintreePaymentController = async (req, res) => {
//     try {
//         const { nonce, cart } = req.body;
//         let total = 0;
//         cart.forEach((i) => { total += i.price });

//         gateway.transaction.sale(
//             {
//                 amount: total,
//                 paymentMethodNonce: nonce,
//                 options: {
//                     submitForSettlement: true,
//                 }
//             },
//             async (error, result) => {
//                 if (error) {
//                     console.error("Braintree error:", error);
//                     return res.status(500).send(error);
//                 }

//                 if (result.success) {
//                     try {
//                         const order = new orderModel({
//                             products: cart.map(p => p._id), // ✅ Only store product IDs
//                             payment: result,
//                             buyer: req.user._id,
//                             status: "Not Processed"
//                         });
//                         await order.save();
//                         res.json({ ok: true });
//                     } catch (err) {
//                         console.error("Order save error:", err);
//                         res.status(500).send("Failed to save order");
//                     }
//                 } else {
//                     res.status(500).send(result.message);
//                 }
//             }
//         );
//     } catch (error) {
//         console.error("Payment controller error:", error);
//         res.status(500).send("Payment failed");
//     }
// };
