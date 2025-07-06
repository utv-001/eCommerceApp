import React, { useState } from 'react'
import Layout from '../../components/layout/Layout.js'
import './auth-style.css'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'

const ForgotPassword = () => {
    const [email, setEmail] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [answer, setAnswer] = useState("")
    
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const res = await axios.post('/api/v1/auth/forgot-password', { email, answer, newPassword })
            if (res.data.success) {
                toast.success(res.data.message)
                navigate("/login")
                setEmail("")
                setNewPassword("")
            } else {
                toast.error(res.data.error)
            }
        } catch (error) {
            console.log(error)
            toast.error("Something went wrong!")
        }
    }
    return (
        <Layout title="Reset_Password - Trivikram's Ecommerce App">
            <div className='form-container'>
                <h1>Reset Password</h1>
                <form>

                    <div className="mb-3">
                        <label htmlFor="exampleInputEmail" className="form-label">
                            Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => { setEmail(e.target.value) }}
                            required
                            className="form-control"
                            id="exampleInputEmail"
                        />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="exampleInputPassword1" className="form-label">
                            New Password
                        </label>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => { setNewPassword(e.target.value) }}
                            required
                            className="form-control"
                            id="exampleInputPassword1"
                        />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="answer" className="form-label">
                            What is your favourite Sport?
                        </label>
                        <input
                            type="text"
                            value={answer}
                            onChange={(e) => { setAnswer(e.target.value) }}
                            required
                            className="form-control"
                            id="answer"
                        />
                    </div>

                    <button onClick={(e)=>{handleSubmit(e)}} className="btn btn-primary w-100">
                        RESET
                    </button>
                </form>
            </div>
        </Layout>
    )
}
export default ForgotPassword