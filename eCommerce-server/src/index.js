import express, { json } from 'express'
import { config } from 'dotenv'
import connectDB from './config/db.js'
import router from './routes/authRoutes.js'
import categoryRouter from './routes/categoryRoutes.js'
import productRouter from './routes/productRoutes.js'
import cors from 'cors'
const app = express()
app.use(json())
config()

connectDB()
app.use(cors())
app.use(express.json())

app.use("/api/v1/auth",router)
app.use("/api/v1/category", categoryRouter)
app.use("/api/v1/product", productRouter)

app.get('/',(req, res)=>{
    res.status(200).json({message: "Welcome to ecommerse platform"})
})

const PORT = process.env.PORT
app.listen(PORT, ()=>{
    console.log(`Server is listening at ${PORT}`)
})