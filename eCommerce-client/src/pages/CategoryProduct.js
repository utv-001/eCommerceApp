import { useEffect, useState } from 'react'
import Layout from '../components/layout/Layout.js'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'

const CategoryProduct = () => {
    const params = useParams()
    const [products, setProducts] = useState([])
    const [category, setCategory] = useState([])
    const navigate = useNavigate()

    useEffect(() => {
        if (params?.slug) {
            getProductsByCategory()
        }
    }, [])

    const getProductsByCategory = async () => {
        try {
            const { data } = await axios.get(`/api/v1/product/product-category/${params.slug}`)
            setProducts(data?.products)
            setCategory(data?.category)
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <Layout>
            <div className="container mt-3">
                <h1 className='text-center'>Category - {category?.name}</h1>
                <h6 className='text-center'>{products.length} products found</h6>
                <div className='row'>
                    <div className='d-flex flex-wrap'>
                        {products?.map((item) => (
                            <div className="card m-2" key={item._id} style={{ width: "18rem" }}>
                                <img src={`/api/v1/product/product-photo/${item._id}`} className="card-img-top" alt={item.name} />
                                <div className="card-body">
                                    <h5 className="card-title">{item.name}</h5>
                                    <p className="card-text">{(item.description.length > 30) ? item.description.substring(0, 30) + "..." : item.description}</p>
                                    <p className="card-text"> $ {item.price}</p>
                                    <button className='btn btn-primary ms-1' onClick={() => { navigate(`/product/${item.slug}`) }}>More Details</button>
                                    <button className='btn btn-secondary ms-1'>Add to Cart</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default CategoryProduct