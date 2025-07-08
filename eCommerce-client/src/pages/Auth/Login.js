import { useState } from 'react'
import Layout from '../../components/layout/Layout.js'
import './auth-style.css'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/auth.js'
import axios from 'axios'
import toast from 'react-hot-toast'

const Login = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [auth, setAuth] = useAuth()
    const navigate = useNavigate()
    const location = useLocation()
    const baseURL = process.env.REACT_APP_API_BASE_URL

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const res = await axios.post(`${baseURL}/api/v1/auth/login`, { email, password })
            if (res.data.success) {
                toast.success(res.data.message)
                setAuth({
                    ...auth, user: res.data.user, token: res.data.token
                })
                localStorage.setItem('auth', JSON.stringify(res.data))
                navigate(location.state || "/")
                setEmail("")
                setPassword("")
            } else {
                toast.error(res.data.error)
            }
        } catch (error) {
            console.log(error)
            toast.error("Something went wrong!")
        }
    }

    return (
        <Layout title="Login - Trivikram's Ecommerce App">
            <div className='form-container'>
                <h1>Login Form</h1>
                <form onSubmit={handleSubmit}>

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
                            Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => { setPassword(e.target.value) }}
                            required
                            className="form-control"
                            id="exampleInputPassword1"
                        />
                    </div>

                    <div className='mb-3'>
                        <button onClick={() => { navigate('/forgot-password') }} className="btn btn-primary w-100">
                            Forgot Password
                        </button>
                    </div>

                    <button type="submit" className="btn btn-primary w-100">
                        LOGIN
                    </button>
                </form>
            </div>
        </Layout>
    )
}

export default Login