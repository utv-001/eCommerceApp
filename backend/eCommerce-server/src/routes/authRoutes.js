import { Router } from 'express'
import {registerController, loginController, testController, forgotPasswordController, updateProfileController, getOrdersController, getAllOrdersController, orderStatusController} from '../controllers/authController.js'
import {requireSignIn, isAdmin} from '../middleware/authMiddleware.js'

const router = Router()

//register user
router.post('/register', registerController)
//login user
router.post('/login', loginController)
//forgot password
router.post('/forgot-password', forgotPasswordController)
//test controller
router.post('/test', requireSignIn, isAdmin, testController)
//protected route
router.get('/user-auth', requireSignIn, (req, res)=>{
    return res.status(200).json({ok: true})
})
//admin route
router.get('/admin-auth', requireSignIn, isAdmin, (req, res)=>{
    return res.status(200).json({ok: true})
})
//update profile
router.put('/profile', requireSignIn, updateProfileController)
//orders
router.get('/orders', requireSignIn, getOrdersController)
//all orders
router.get('/all-orders', requireSignIn, isAdmin, getAllOrdersController)
//order status update
router.put('/order-status/:orderId', requireSignIn, isAdmin, orderStatusController)

export default router