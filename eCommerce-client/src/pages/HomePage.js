import { useState, useEffect } from 'react'
import Layout from '../components/layout/Layout.js'
import toast from 'react-hot-toast'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { Checkbox, Radio } from 'antd'
import { Prices } from '../components/Prices.js'
import { useCart } from '../context/cart.js'

const HomePage = () => {
    const navigate = useNavigate()
    const [cart, setCart] = useCart()
    const [products, setProducts] = useState([])
    const [categories, setCategories] = useState([])
    const [checked, setChecked] = useState([])
    const [radio, setRadio] = useState([])
    const [total, setTotal] = useState(0)
    const [page, setPage] = useState(1)
    const [loading, setLoading] = useState(false)

    //get all products
    const getAllProducts = async () => {
        try {
            setLoading(true)
            const { data } = await axios.get(`/api/v1/product/product-list/${page}`)
            setLoading(false)
            setProducts(data.products)
        } catch (error) {
            setLoading(false)
            console.log(error)
            toast.error('Something went wrong in getting products')
        }
    }
    //get all categories
    const getAllCategories = async () => {
        try {
            const { data } = await axios.get('/api/v1/category/all-categories')
            if (data?.success) {
                setCategories(data?.category)
            }
        } catch (error) {
            console.log(error)
            toast.error('Something went wrong while getting Categories')
        }
    }

    useEffect(() => {
        getAllCategories();
        getTotal();
    }, [])

    //get total count
    const getTotal = async () => {
        try {
            const { data } = await axios.get('/api/v1/product/product-count')
            setTotal(data?.total)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(()=>{
        if(page === 1){
            return;
        }
        loadMore()
    }, [page])

    //load more
    const loadMore = async ()=>{
        try{
            setLoading(true)
            const {data} = await axios.get(`/api/v1/product/product-list/${page}`)
            setLoading(false)
            setProducts([...products, ...data?.products])
        }catch(error){
            setLoading(false)
            console.log(error)
        }
    }

    //filter by category
    const handleFilter = (value, id) => {
        let all = [...checked]
        if (value) {
            all.push(id)
        } else {
            all = all.filter(c => c !== id)
        }
        setChecked(all)
    }

    //get filtered products
    const filterProduct = async () => {
        try {
            const { data } = await axios.post(`/api/v1/product/product-filters`, { checked, radio })
            setProducts(data?.products)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        if (!checked.length || !radio.length) {
            getAllProducts();
        }
    }, [checked.length, radio.length])

    useEffect(() => {
        if (checked.length || radio.length) {
            filterProduct();
        }
    }, [checked, radio])

    return (
        <Layout title={'All Products - Best Offers Ecommerce App'}>
            <div className='container-fluid row mt-3'>
                <div className='col-md-2'>
                    <h6 className='text-center'>Filter by category</h6>
                    <div className='d-flex flex-column'>
                        {categories?.map((cat) => (
                            <Checkbox key={cat._id} onChange={(e) => handleFilter(e.target.checked, cat._id)}>{cat.name}</Checkbox>
                        ))}
                    </div>
                    {/* price filter */}
                    <h6 className='text-center mt-4'>Filter by price</h6>
                    <div className='d-flex flex-column'>
                        <Radio.Group onChange={e => setRadio(e.target.value)}>
                            {Prices?.map(p => (
                                <div key={p._id}>
                                    <Radio value={p.array}>{p.name}</Radio>
                                </div>
                            ))}
                        </Radio.Group>
                    </div>
                    <div>
                        <button className='btn btn-outline-danger mt-2' onClick={() => window.location.reload()}>Reset Filters</button>
                    </div>
                </div>
                <div className='col-md-9'>
                    <h1 className='text-center'>All Products</h1>
                    <div className='d-flex flex-wrap'>
                        {products?.map((item) => (
                            <div className="card m-2" key={item._id} style={{ width: "18rem" }}>
                                <img src={`/api/v1/product/product-photo/${item._id}`} className="card-img-top" alt={item.name} />
                                <div className="card-body">
                                    <h5 className="card-title">{item.name}</h5>
                                    <p className="card-text">{(item.description.length > 30) ? item.description.substring(0, 30) + "..." : item.description}</p>
                                    <p className="card-text"> $ {item.price}</p>
                                    <button className='btn btn-primary ms-1' onClick={()=>{navigate(`/product/${item.slug}`)}}>More Details</button>
                                    <button className='btn btn-secondary ms-1' onClick={()=>{
                                        setCart([...cart, item]);
                                        localStorage.setItem('cart', JSON.stringify([...cart, item]))
                                        toast.success('Item added to cart');}}>Add to Cart</button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className='m-2 p-3'>
                        {products && products.length < total && (
                            <button className='btn btn-warning' onClick={(e)=>{
                                e.preventDefault()
                                setPage(page + 1)
                            }}>
                                {loading ? "Loading..." : "Loadmore"}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default HomePage;