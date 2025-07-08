import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useAuth } from '../../context/auth.js'
import Layout from '../../components/layout/Layout'
import AdminMenu from '../../components/layout/AdminMenu'

const Users = () => {
    const [users, setUsers] = useState([])
    const [auth, setAuth] = useAuth()
    const baseURL = process.env.REACT_APP_API_BASE_URL

    const getUsers = async () => {
        const res = await axios.get(`${baseURL}/api/v1/auth/users`)
        setUsers(res?.data?.users)
    }

    useEffect(() => { getUsers() }, [auth?.token])

    return (
        <Layout title={'Dashboard - All Users'}>
            <div className='container-fluid m-3 p-3'>
                <div className='row'>
                    <div className='col-md-3'>
                        <AdminMenu />
                    </div>
                    <div className='col-md-9'>
                        <h1>All users</h1>
                        {users ? (
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th scope="col">#</th>
                                        <th scope="col">Name</th>
                                        <th scope="col">Email</th>
                                        <th scope="col">Phone</th>
                                        <th scope="col">Address</th>
                                        <th scope="col">Role</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map((user, i) => {
                                        return (
                                            <tr key={user._id}>
                                                <td scope="col">{i+1}</td>
                                                <td scope="col">{user?.name}</td>
                                                <td scope="col">{user?.email}</td>
                                                <td scope="col">{user?.phone}</td>
                                                <td scope="col">{user?.address}</td>
                                                <td scope="col">{user?.role === 1 ? "Admin" : "Standard User"}</td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>) : (<h4>"No users found"</h4>)
                        }
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default Users