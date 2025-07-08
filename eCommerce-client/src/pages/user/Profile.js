import React, { useState, useEffect } from 'react'
import Layout from '../../components/layout/Layout.js'
import UserMenu from '../../components/layout/UserMenu'
import { useAuth } from '../../context/auth.js'
import toast from 'react-hot-toast'
import axios from 'axios'

const Profile = () => {
    //context
    const [auth, setAuth] = useAuth()
    //state
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [phone, setPhone] = useState("")
    const [address, setAddress] = useState("")
    const baseURL = process.env.REACT_APP_API_BASE_URL

    useEffect(()=>{
        const {name, email, phone, address} = auth?.user
        setName(name)
        setEmail(email)
        setPhone(phone)
        setAddress(address)
    }, [auth?.user])

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const {data} = await axios.put(`${baseURL}/api/v1/auth/profile`, { name, password, phone, address })
            if (data?.error) {
                toast.error(data?.error)
            } else {
                setAuth({...auth, user: data?.updatedUser})
                let ls = localStorage.getItem('auth')
                ls = JSON.parse(ls)
                ls.user = data.updatedUser
                localStorage.setItem('auth',JSON.stringify(ls))
                toast.success('Profile updated successfully')
            }
        } catch (error) {
            console.log(error)
            toast.error("Something went wrong!")
        }
    }

    return (
        <Layout title={'Your Profile'}>
            <div className='container-fluid m-3 p-3'>
                <div className='row'>
                    <div className='col-md-3'>
                        <UserMenu />
                    </div>
                    <div className='col-md-9'>
                        <div className='form-container'>
                            <form onSubmit={handleSubmit}>
                                <h4 className='title'>User Profile</h4>
                                <div className="mb-3">
                                    <label htmlFor="exampleInputName" className="form-label">Name</label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => { setName(e.target.value) }}
                                        
                                        className="form-control"
                                        id="exampleInputName"
                                    />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="exampleInputEmail" className="form-label">Email</label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => { setEmail(e.target.value) }}
                                        
                                        className="form-control"
                                        id="exampleInputEmail"
                                        disabled
                                    />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => { setPassword(e.target.value) }}
                                        
                                        className="form-control"
                                        id="exampleInputPassword1"
                                    />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="exampleInputPhone" className="form-label">Phone</label>
                                    <input
                                        type="text"
                                        value={phone}
                                        onChange={(e) => { setPhone(e.target.value) }}
                                        
                                        className="form-control"
                                        id="exampleInputPhone"
                                    />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="exampleInputAddress" className="form-label">Address</label>
                                    <input
                                        type="text"
                                        value={address}
                                        onChange={(e) => { setAddress(e.target.value) }}
                                        
                                        className="form-control"
                                        id="exampleInputAddress"
                                    />
                                </div>

                                <button type="submit" className="btn btn-primary">Update</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default Profile