import { useState, useEffect } from 'react'
import AdminMenu from '../../components/layout/AdminMenu.js'
import Layout from '../../components/layout/Layout.js'
import axios from 'axios'
import toast from 'react-hot-toast'
import { Link } from 'react-router-dom'

export default function Products() {
    const [products, setProducts] = useState([])
    const baseURL = process.env.REACT_APP_API_BASE_URL

    //get all products
    const getAllProducts = async () => {
        try {
            const { data } = await axios.get(`${baseURL}/api/v1/product/get-product`)
            if (data?.success) {
                toast.success(data?.message)
                setProducts(data?.products)
            } else {
                toast.error(data?.message)
            }
        } catch (error) {
            console.log(error)
            toast.error('Something went wrong while getting products')
        }
    }

    useEffect(() => { getAllProducts() }, [])

    return (
        <Layout>
            <div className='row'>
                <div className='col-md-3'>
                    <AdminMenu />
                </div>
                <div className='col-md-9'>
                    <h1 className='text-center'>All Products list</h1>
                    <div className='d-flex flex-wrap'>
                        {products?.map((item) => (
                            <Link to={`/dashboard/admin/product/${item.slug}`} key={item._id} className='product-link'>
                                <div className="card m-2" style={{ width: "18rem" }}>
                                    <img src={`${baseURL}/api/v1/product/product-photo/${item._id}`} className="card-img-top" alt={item.name} />
                                    <div className="card-body">
                                        <h5 className="card-title">{item.name}</h5>
                                        <p className="card-text">{(item.description.length > 30) ? item.description.substring(0, 30) + "..." : item.description}</p>
                                        <p className="card-text"> $ {item.price}</p>
                                        <button className='btn btn-primary ms-1'>More Details</button>
                                        <button className='btn btn-secondary ms-1'>Add to Cart</button>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </Layout>
    )
}