import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'
import moment from 'moment'
import { useAuth } from '../../context/auth.js'
import AdminMenu from '../../components/layout/AdminMenu.js'
import Layout from '../../components/layout/Layout.js'
import { Select } from 'antd'
const { Option } = Select

const AdminOrders = () => {
    const [auth, setAuth] = useAuth()
    const [orders, setOrders] = useState([])
    const [status, setStatus] = useState(["Not Processed", "Processing", "Shipped", "Delivered", "Cancelled"])
    const [changeStatus, setChangeStatus] = useState("")
    const navigate = useNavigate()
    const baseURL = process.env.REACT_APP_API_BASE_URL

    const getOrders = async () => {
        try {
            const { data } = await axios.get(`${baseURL}/api/v1/auth/all-orders`)
            setOrders(data)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => { if (auth?.token) getOrders() }, [auth?.token])

    const handleChange = async (orderId, value) => {
        try {
            const { data } = await axios.put(`${baseURL}/api/v1/auth/order-status/${orderId}`, { status: value })
            getOrders()
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <Layout title={'All Orders'}>
            <div className='row'>
                <div className='col-md-3'>
                    <AdminMenu />
                </div>
                <div className='col-md-9'>
                    <h1 className='text-center'>All Orders</h1>
                    {
                        orders ?
                            (
                                <>
                                    <div className="border shadow">
                                        {orders.map((o, i) => {
                                            return (
                                                <div key={i}>
                                                    <table className="table">
                                                        <thead>
                                                            <tr>
                                                                <th scope="col">#</th>
                                                                <th scope="col">Status</th>
                                                                <th scope="col">Buyer</th>
                                                                <th scope="col">Ordered at</th>
                                                                <th scope="col">Payment</th>
                                                                <th scope="col">Quantity</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            <tr>
                                                                <td>{i + 1}</td>
                                                                <td>
                                                                    <Select onChange={(value, orderId) => { handleChange(o._id, value) }} defaultValue={o?.status}>
                                                                        {status.map((s, i) => (
                                                                            <Option key={i} value={s}>{s}</Option>
                                                                        ))}
                                                                    </Select>
                                                                </td>
                                                                <td>{o?.buyer?.name}</td>
                                                                <td>{moment(o?.createdAt).fromNow()}</td>
                                                                <td>{o?.payment?.success ? "Success" : "Failed"}</td>
                                                                <td>{o?.products?.length}</td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                    <div className='col-md-6 d-flex flex-row'>
                                                        {o?.products?.map((item) => (
                                                            <div className="card m-2" key={item._id} style={{ width: "15rem" }}>
                                                                <img src={`${baseURL}/api/v1/product/product-photo/${item._id}`} className="card-img-top" alt={item.name} />
                                                                <div className="card-body">
                                                                    <h5 className="card-title">{item.name}</h5>
                                                                    <p className="card-text">{(item.description.length > 30) ? item.description.substring(0, 30) + "..." : item.description}</p>
                                                                    <p className="card-text"> $ {item.price}</p>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </>
                            ) : "No orders found"
                    }
                </div>
            </div>
        </Layout>
    )
}

export default AdminOrders