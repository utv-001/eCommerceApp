import JWT from 'jsonwebtoken'
import userModel from '../models/userModel.js'

//protected routes token base
export const requireSignIn = async (req, res, next)=>{
    try{
        const decode = JWT.verify(req.headers.authorization, process.env.JWT_SECRETKEY)
        req.user = decode
        next()
    }catch(error){
        console.log(error)
        return res.status(500).json({
            success:false,
            message:"Some error occured",
            error
        })
    }
}

//admin access
export const isAdmin = async (req, res, next)=>{
    try{
        const user = await userModel.findById(req.user._id)
        // console.log(user)
        if(user.role !== 1){
            // return res.status(401).send({
            //     success: false,
            //     message: "Unauthorized Access"
            // })
        }else{
            next()
        }
    }catch(error){
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "Some error occured",
            error
        })
    }
}