import { useState, useEffect } from 'react'
import Layout from '../../components/layout/Layout.js'
import AdminMenu from '../../components/layout/AdminMenu.js'
import toast from 'react-hot-toast'
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom'
import Modal from '../../components/modal/Modal.js'
import DeleteConfirmation from '../../components/forms/delete-confirmation/DeleteConfirmation.js'

const UpdateProduct = () => {
    const [categories, setCategories] = useState([])
    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [category, setCategory] = useState("")
    const [photo, setPhoto] = useState("")
    const [price, setPrice] = useState(0)
    const [quantity, setQuantity] = useState(0)
    const [shipping, setShipping] = useState()
    const [productId, setProductId] = useState()
    const [id, setId] = useState()
    const [visible, setVisible] = useState(false)
    const baseURL = process.env.REACT_APP_API_BASE_URL

    const navigate = useNavigate()
    const params = useParams()

    //get single product
    const getSingleproduct = async () => {
        try {
            const { data } = await axios.get(`${baseURL}/api/v1/product/get-product/${params.slug}`)
            // console.log(data.product)
            if (data?.success) {
                setName(data?.product?.name)
                setDescription(data?.product?.description)
                setPrice(data?.product?.price)
                setQuantity(data?.product?.quantity)
                setCategory(data?.product?.category)
                setShipping(data?.product?.shipping)
                setProductId(data?.product?._id)
                setId(data?.product?.category?._id)
            }
        } catch (error) {
            console.log(error)
            toast.error('Something went wrong while fetching product')
        }
    }

    //get all category
    const getAllCategory = async () => {
        try {
            const { data } = await axios.get(`${baseURL}/api/v1/category/all-categories`)
            if (data?.success) {
                setCategories(data?.category)
            }
        } catch (error) {
            console.log(error)
            toast.error('Something went wrong while getting Categories')
        }
    }

    const handleSelectedCategory = async (name) => {
        const selectedCategory = categories.find(cat => cat.name === name)
        console.log(selectedCategory._id)
        setCategory(selectedCategory)
        setId(selectedCategory._id)
    }

    useEffect(() => { getSingleproduct(); getAllCategory(); }, [])

    //to update product
    const handleUpdateProduct = async (e) => {
        e.preventDefault()
        try {
            const productData = new FormData()
            productData.append('name', name)
            productData.append('description', description)
            productData.append('category', id)
            photo && productData.append('photo', photo)
            productData.append('price', price)
            productData.append('quantity', quantity)
            productData.append('shipping', shipping)
            const { data } = await axios.put(`${baseURL}/api/v1/product/update-product/${productId}`, productData)
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

    //delete product
    const deleteProduct = async () => {
        try {
            const { data } = await axios.delete(`${baseURL}/api/v1/product/delete-product/${productId}`)
            if (data?.success) {
                toast.success(data?.message)
                navigate('/dashboard/admin/products')
            } else {
                toast.error(data?.message)
            }
        } catch (error) {
            console.log(error)
            toast.error('Something went wrong while deleting the product')
        }
    }

    return (
        <Layout title={'Dashboard - update Product'}>
            <div className='container-fluid m-3 p-3'>
                <div className='row'>
                    <div className='col-md-3'>
                        <AdminMenu />
                    </div>
                    <div className='col-md-9'>
                        <Modal visible={visible} onClose={() => { setVisible(false) }}>
                            <DeleteConfirmation handleSubmit={deleteProduct} onClose={() => setVisible(false)} />
                        </Modal>
                        <h1>Update Product</h1>
                        <div className='m-1 w-75'>
                            <select className="form-select form-select-lg" value={category ? category.name : 'Select a category'} onChange={(e) => { handleSelectedCategory(e.target.value) }}>
                                <option value={'Select a category'}>Select a category</option>
                                {categories.map((item) => {
                                    return (
                                        <option value={item.name} key={item._id}>{item.name}</option>
                                    )
                                })}
                            </select>
                            <div className='mt-3 mb-3'>
                                <label className='btn btn-outline-secondary col-md-12'>
                                    {photo ? photo.name : "Upload photo"}
                                    <input type='file' name='photo' accept='image/*' onChange={(e) => setPhoto(e.target.files[0])} hidden />
                                </label>
                            </div>
                            <div className='mb-3'>
                                {photo ? (
                                    <div className='text-center'>
                                        <img src={URL.createObjectURL(photo)} alt='product_photo' height={'200px'} className='img img-responsive' />
                                    </div>
                                ) : (
                                    <div className='text-center'>
                                        <img src={`${baseURL}/api/v1/product/product-photo/${productId}`} alt={name} height={'200px'} className='img img-responsive' />
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
                            <div className='d-flex col gap-5'>
                                <div className='mb-3'>
                                    <button className='btn btn-primary' onClick={handleUpdateProduct}>Update Product</button>
                                </div>
                                <div className='mb-3'>
                                    <button className='btn btn-danger' onClick={()=>{setVisible(true)}}>Delete Product</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default UpdateProduct