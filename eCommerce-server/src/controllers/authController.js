import userModel from '../models/userModel.js'
import orderModel from '../models/orderModel.js'
import { hashPassword, comparePasswords } from '../helpers/authHelper.js'
import JWT from 'jsonwebtoken'

export const registerController = async (req, res) => {
    try {
        const { name, email, password, phone, address, answer } = req.body
        if (!name) {
            return res.status(400).json({ message: "Name is required" })
        }
        if (!email) {
            return res.status(400).json({ message: "Email is required" })
        }
        if (!password) {
            return res.status(400).json({ message: "Password is required" })
        }
        if (!phone) {
            return res.status(400).json({ message: "Phone is required" })
        }
        if (!address) {
            return res.status(400).json({ message: "Address is required" })
        }
        if (!answer) {
            return res.status(400).json({ message: "Answer is required" })
        }

        const existingUser = await userModel.findOne({ email })
        if (existingUser) {
            return res.status(200).json({
                success: false,
                message: "Already registered, please login"
            })
        }

        const hashedPassword = await hashPassword(password)
        const user = new userModel({ name, email, password: hashedPassword, phone, address, answer })
        const savedUser = await user.save()
        return res.status(201).json({
            success: true,
            message: "User registered successfully",
            user: savedUser
        })

    } catch (error) {
        // console.log(error)
        return res.status(500).json({
            success: false,
            message: "Error in registration",
            error
        })
    }
}

export const loginController = async (req, res) => {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            return res.status(404).json({
                success: false,
                message: "Invalid email or password",
            })
        }
        const user = await userModel.findOne({ email })
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Email is not registered"
            })
        }
        const match = await comparePasswords(password, user.password)
        if (!match) {
            return res.status(400).json({
                success: false,
                message: "Invalid password"
            })
        }
        const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRETKEY, { expiresIn: "7d" })
        return res.status(200).json({
            success: true,
            message: "User logged in succesfully",
            user,
            token
        })
    } catch (error) {
        // console.log(error)
        return res.status(500).json({
            success: false,
            message: "Error in login",
            error
        })
    }
}

export const getAllUsers = async (req, res) => {
    try {
        const users = await userModel.find()
        return res.status(200).json({
            success: true,
            message: "User fetched succesfully",
            users
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error in getting users",
            error
        })
    }
}

export const forgotPasswordController = async (req, res) => {
    try {
        const { email, answer, newPassword } = req.body
        if (!email) {
            return res.status(400).json({
                message: 'Email is required'
            })
        }
        if (!answer) {
            return res.status(400).json({
                message: 'Answer is required'
            })
        }
        if (!newPassword) {
            return res.status(400).json({
                message: 'New password is required'
            })
        }
        const user = await userModel.findOne({ email, answer })
        if (!user) {
            res.status(404).json({
                success: false,
                message: "Wrong email or answer"
            })
        }
        const hashed = await hashPassword(newPassword)
        await userModel.findByIdAndUpdate(user._id, { password: hashed })
        res.status(200).json({
            success: true,
            message: "Password reset successfully"
        })
    } catch (error) {
        // console.log(error)
        return res.status(500).json({
            success: false,
            message: "Something went wrong!",
            error
        })
    }
}

export const testController = async (req, res) => {
    try {
        res.send("Protected Routes")
    } catch (error) {
        // console.log(error)
        res.send({ error })
    }
}

export const updateProfileController = async (req, res) => {
    try {
        const { name, password, address, phone } = req.body
        const user = await userModel.findById(req?.user?._id)
        //password
        if (password && password.length < 8) {
            return res.json({ error: 'Password is required and should be minimum of 8 characters long' })
        }
        const hashedPassword = password ? await hashPassword(password) : undefined
        const updatedUser = await userModel.findByIdAndUpdate(req.user._id, {
            name: name || user.name,
            password: hashedPassword || user.password,
            phone: phone || user.phone,
            address: address || user.address
        }, { new: true })
        return res.status(200).send({
            success: true,
            message: 'Profile updated successfully',
            updatedUser
        })
    } catch (error) {
        // console.log(error)
        return res.status(400).send({
            success: false,
            message: 'Error while updating profile',
            error
        })
    }
}

export const getOrdersController = async (req, res) => {
    try {
        const orders = await orderModel.find({ buyer: req.user._id }).populate("products", "-photo").populate("buyer", "name")
        // console.log(orders)
        res.json(orders)
    } catch (error) {
        // console.log(error)
        return res.status(500).send({
            success: false,
            message: "Error while getting orders",
            error
        })
    }
}

export const getAllOrdersController = async (req, res) => {
    try {
        const orders = await orderModel.find().populate("products", "-photo").populate("buyer", "name").sort({ createdAt: -1 })
        // console.log(orders)
        res.json(orders)
    } catch (error) {
        // console.log(error)
        res.status(500).send({
            success: false,
            message: 'Error while getting all orders',
            error
        })
    }
}

export const orderStatusController = async (req, res) => {
    try {
        const { orderId } = req.params
        const { status } = req.body
        const orders = await orderModel.findByIdAndUpdate(orderId, { status }, { new: true })
        res.json(orders)
    } catch (error) {
        // console.log(error)
        res.status(500).send({
            success: false,
            message: 'Error while updating order status',
            error
        })
    }
}