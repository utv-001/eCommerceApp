import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../../components/layout/Layout.js'
import UserMenu from '../../components/layout/UserMenu.js'
import axios from 'axios'
import moment from 'moment'
import { useAuth } from '../../context/auth'

const Orders = () => {
    const [orders, setOrders] = useState([])
    const [auth, setAuth] = useAuth()
    const navigate = useNavigate()
    const getOrders = async () => {
        try {
            const { data } = await axios.get('/api/v1/auth/orders')
            setOrders(data)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => { if (auth?.token) getOrders() }, [auth?.token])

    return (
        <Layout title='Your Orders'>
            <div className='container-fluid p-3 m-3'>
                <div className='row'>
                    <div className='col-md-3'>
                        <UserMenu />
                    </div>
                    <div className='col-md-9'>
                        {orders ?
                            (
                                <>
                                    <h1 className="text-center">All Orders</h1>
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
                                                                <td>{o.status}</td>
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
                                                                <img src={`/api/v1/product/product-photo/${item._id}`} className="card-img-top" alt={item.name} />
                                                                <div className="card-body">
                                                                    <h5 className="card-title">{item.name}</h5>
                                                                    <p className="card-text">{(item.description.length > 30) ? item.description.substring(0, 30) + "..." : item.description}</p>
                                                                    <p className="card-text"> $ {item.price}</p>
                                                                    <button className='btn btn-primary ms-1' onClick={() => { navigate(`/product/${item.slug}`) }}>More Details</button>
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
            </div>
        </Layout>
    )
}

export default Orders