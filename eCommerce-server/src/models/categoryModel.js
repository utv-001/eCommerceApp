import mongoose from "mongoose"

const categorySchema = new mongoose.Schema({
    name:{
        type: String
        // required: true,
        // unique: true
    },
    slug:{
        type: String,
        lowercase: true
    }
})

const categoryModel = mongoose.model("categoryModel", categorySchema)

export default categoryModel