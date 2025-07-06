import { useState, useEffect } from 'react'
import Layout from '../../components/layout/Layout.js'
import AdminMenu from '../../components/layout/AdminMenu.js'
import toast from 'react-hot-toast'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const CreateProduct = () => {
    const [categories, setCategories] = useState([])
    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [category, setCategory] = useState()
    const [id, setId] = useState()
    const [photo, setPhoto] = useState(null)
    const [price, setPrice] = useState(0)
    const [quantity, setQuantity] = useState(0)
    const [shipping, setShipping] = useState()

    const navigate = useNavigate()

    //get all category
    const getAllCategory = async () => {
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

    const handleSelectedCategory = async (name) => {
        const cat = await categories.find(cat => cat.name === name)
        console.log(cat)
        setCategory(cat)
        setId(cat._id)
    }

    useEffect(() => { getAllCategory() }, [])

    const handleCreateProduct = async (e) => {
        e.preventDefault()
        try {
            const productData = new FormData()
            productData.append('name', name)
            productData.append('description', description)
            productData.append('category', id)
            productData.append('photo', photo)
            productData.append('price', price)
            productData.append('quantity', quantity)
            productData.append('shipping', shipping)
            const { data } = await axios.post('/api/v1/product/create-product', productData)
            if (data?.success) {
                toast.success(data?.message)
                navigate('/dashboard/admin/products')
            } else {
                toast.error(data?.message)
            }
        } catch (error) {
            console.log(error)
            toast.error('Something went wrong while creating product')
        }
    }

    return (
        <Layout title={'Dashboard - Create Product'}>
            <div className='container-fluid m-3 p-3'>
                <div className='row'>
                    <div className='col-md-3'>
                        <AdminMenu />
                    </div>
                    <div className='col-md-9'>
                        <h1>Create Product</h1>
                        <div className='m-1 w-75'>
                            <select className="form-select form-select-lg" defaultValue={'Select a category'} onChange={(e) => { handleSelectedCategory(e.target.value) }}>
                                <option value={'Select a category'}>Select a category</option>
                                {categories.map((item) => (
                                    <option value={item.name} key={item._id}>{item.name}</option>
                                ))}
                            </select>
                            <div className='mt-3 mb-3'>
                                <label className='btn btn-outline-secondary col-md-12'>
                                    {photo ? photo.name : "Upload photo"}
                                    <input type='file' name='photo' accept='image/*' onChange={(e) => setPhoto(e.target.files[0])} hidden />
                                </label>
                            </div>
                            <div className='mb-3'>
                                {photo && (
                                    <div className='text-center'>
                                        <img src={URL.createObjectURL(photo)} alt='product_photo' height={'200px'} className='img img-responsive' />
                                    </div>
                                )}
                            </div>
                            <div className='mb-3'>
                                <label>Enter product name:</label>
                                <input type='text' value={name} className='form-control' onChange={(e) => setName(e.target.value)} />
                            </div>
                            <div className='mb-3'>
                                <label>Enter product description:</label>
                                <textarea type='text' value={description} className='form-control' onChange={(e) => setDescription(e.target.value)} />
                            </div>
                            <div className='mb-3'>
                                <label>Enter product price:</label>
                                <input type='number' value={price} className='form-control' onChange={(e) => setPrice(e.target.value)} />
                            </div>
                            <div className='mb-3'>
                                <label>Enter product quantity:</label>
                                <input type='number' value={quantity} className='form-control' onChange={(e) => setQuantity(e.target.value)} />
                            </div>
                            <div className='mb-3'>
                                <label>Select shipping</label>
                                <select className="form-select form-select-lg" value={shipping} onChange={(e) => setShipping(e.target.value)}>
                                    <option value={''}>Yes/No</option>
                                    <option value={true}>Yes</option>
                                    <option value={false}>No</option>
                                </select>
                            </div>
                            <div className='mb-3'>
                                <button className='btn btn-primary' onClick={handleCreateProduct}>Create Product</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default CreateProduct