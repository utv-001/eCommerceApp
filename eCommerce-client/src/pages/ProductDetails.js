import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'
import Layout from '../components/layout/Layout.js'
import { useCart } from '../context/cart.js'

const ProductDetails = () => {
    const params = useParams()
    const [cart, setCart] = useCart()
    const [product, setProduct] = useState({})
    const [relatedProducts, setRelatedproducts] = useState([])
    const navigate = useNavigate()
    const baseURL = process.env.REACT_APP_API_BASE_URL
    //initail product details
    useEffect(() => {
        if (params?.slug) {
            getProduct()
        }
    }, [params?.slug])

    //get product
    const getProduct = async () => {
        try {
            const { data } = await axios.get(`${baseURL}/api/v1/product/get-product/${params.slug}`)
            setProduct(data?.product)
            getSimilarProducts(data?.product?._id, data?.product?.category?._id)
        } catch (error) {
            console.log(error)
        }
    }

    //get similar products
    const getSimilarProducts = async (pid, cid) => {
        try {
            const { data } = await axios.get(`${baseURL}/api/v1/product/related-product/${pid}/${cid}`)
            setRelatedproducts(data?.products)
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <Layout>
            <div className='row container mt-2 mb-2'>
                <div className='col-md-6'>
                    <img src={`${baseURL}/api/v1/product/product-photo/${product._id}`} className="card-img-top" alt={product.name} height={'300px'} width={'300px'} />
                </div>
                <div className='col-md-6'>
                    <h1 className='md-6 text-center'>Product Details</h1>
                    <h6>Name: {product.name}</h6>
                    <h6>Price: {product.price}$</h6>
                    <h6>Category: {product?.category?.name}</h6>
                    <h6>Description: {product.description}</h6>
                    <h6>Shipping: {product.shipping ? "Yes" : "No"}</h6>
                    <button className='btn btn-secondary' onClick={() => {
                        setCart([...cart, product]);
                        localStorage.setItem('cart', JSON.stringify([...cart, product]))
                        toast.success('Item added to cart');
                    }}>Add to Cart</button>
                </div>
            </div>
            <div className='row container'>
                <h3>Similar products</h3>
                {relatedProducts.length < 1 && <p className='text-center'>No similar products found</p>}
                <div className='d-flex flex-wrap'>
                    {relatedProducts?.map((item) => (
                        <div className="card m-2" key={item._id} style={{ width: "18rem" }}>
                            <img src={`${baseURL}/api/v1/product/product-photo/${item._id}`} className="card-img-top" alt={item.name} />
                            <div className="card-body">
                                <h5 className="card-title">{item.name}</h5>
                                <p className="card-text">{(item.description.length > 30) ? item.description.substring(0, 30) + "..." : item.description}</p>
                                <p className="card-text"> $ {item.price}</p>
                                <button className='btn btn-primary ms-1' onClick={() => { navigate(`/product/${item.slug}`) }}>More Details</button>
                                <button className='btn btn-secondary ms-1' onClick={() => {
                                    setCart([...cart, item]);
                                    localStorage.setItem('cart', JSON.stringify([...cart, item]))
                                    toast.success('Item added to cart');
                                }}>Add to Cart</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </Layout>
    )
}

export default ProductDetails