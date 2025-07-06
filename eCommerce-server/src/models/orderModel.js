import mongoose from "mongoose"

const orderSchema = new mongoose.Schema(
    {
        products: [
            {
                type: mongoose.ObjectId,
                ref: "productModel"
            }
        ],
        payment: {},
        buyer: {
            type: mongoose.ObjectId,
            ref: "users"
        },
        status: {
            type: String,
            default: "Not Processed",
            enum: ["Not Processed", "Processing", "Shipped", "Delivered", "Cancelled"]
        }
    },
    { timestamps: true }
)

const orderModel = mongoose.model("orderModel", orderSchema)

export default orderModel