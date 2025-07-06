import React, {useState} from 'react'
import Layout from '../../components/layout/Layout.js'
import './auth-style.css'
import {useNavigate} from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'

const Register = () => {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [phone, setPhone] = useState("")
    const [address, setAddress] = useState("")
    const [answer, setAnswer] = useState("")
    const navigate = useNavigate()

    const handleSubmit = async (e)=>{
        e.preventDefault()
        try{
            const res = await axios.post('/api/v1/auth/register', {name, email, password, phone, address, answer} )
            if(res.data.success){
                toast.success(res.data.message)
                navigate('/login')
            }else{
                toast.error(res.data.error)
            }
        }catch(error){
            console.log(error)
            toast.error("Something went wrong!")
        }
    }
    return (
        <Layout title="Register - Trivikram's Ecommerce App">
            <div className='form-container'>
                <h1>Register Form</h1>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="exampleInputName" className="form-label">
                            Name
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e)=>{setName(e.target.value)}}
                            required
                            className="form-control"
                            id="exampleInputName"
                        />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="exampleInputEmail" className="form-label">
                            Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e)=>{setEmail(e.target.value)}}
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
                            onChange={(e)=>{setPassword(e.target.value)}}
                            required
                            className="form-control"
                            id="exampleInputPassword1"
                        />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="exampleInputPhone" className="form-label">
                            Phone
                        </label>
                        <input
                            type="text"
                            value={phone}
                            onChange={(e)=>{setPhone(e.target.value)}}
                            required
                            className="form-control"
                            id="exampleInputPhone"
                        />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="exampleInputAddress" className="form-label">
                            Address
                        </label>
                        <input
                            type="text"
                            value={address}
                            onChange={(e)=>{setAddress(e.target.value)}}
                            required
                            className="form-control"
                            id="exampleInputAddress"
                        />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="exampleInputAnswer" className="form-label">
                            What is your favourite sports?
                        </label>
                        <input
                            type="text"
                            value={answer}
                            onChange={(e)=>{setAnswer(e.target.value)}}
                            required
                            className="form-control"
                            id="exampleInputAnswer"
                        />
                    </div>

                    <button type="submit" className="btn btn-primary">
                        REGISTER
                    </button>
                </form>

            </div>
        </Layout>
    )
}

export default Register
