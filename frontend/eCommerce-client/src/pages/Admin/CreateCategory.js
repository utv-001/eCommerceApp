import { useState, useEffect } from 'react'
import Layout from '../../components/layout/Layout.js'
import AdminMenu from '../../components/layout/AdminMenu.js'
import CategoryForm from '../../components/forms/CategoryForm.js'
import toast from 'react-hot-toast'
import axios from 'axios'
import Modal from '../../components/modal/Modal.js'
import DeleteConfirmation from '../../components/forms/delete-confirmation/DeleteConfirmation.js'

const CreateCategory = () => {
    const [category, setCategories] = useState([])
    const [name, setName] = useState("")
    const [visible, setVisible] = useState(false)
    const [selected, setSelected] = useState(null)
    const [updatedName, setUpdatedName] = useState("")
    const [delVisible, setDelVisible] = useState(false)
    const [delItem, setDelItem] = useState(null)

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const { data } = await axios.post('/api/v1/category/create-category', { name })
            if (data?.success) {
                toast.success(`${name} created successfully`)
            } else {
                toast.error("data.message")
            }
            setName("")
            getAllCategory()
        } catch (error) {
            console.log(error)
            toast.error("Something went wrong in input form")
        }
    }

    const getAllCategory = async () => {
        try {
            const {data} = await axios.get('/api/v1/category/all-categories')
            if (data?.success) {
                setCategories(data?.category)
            }
        } catch (error) {
            console.log(error)
            toast.error('Something went wrong while getting Categories')
        }
    }

    useEffect(() => { getAllCategory() }, [])

    const handleUpdate = async (e) => {
        e.preventDefault()
        try {
            const { data } = await axios.put(`/api/v1/category/update-category/${selected._id}`, { name: updatedName })
            if (data.success) {
                toast.success(`${data.message}`)
                setSelected(null)
                setUpdatedName("")
                setVisible(false)
                getAllCategory()
            } else {
                toast.error(`${data.message}`)
            }
        } catch (error) {
            console.log(error)
            toast.error('Something went wrong')
        }
    }

    const handleDelete = async (id) => {
        try {
            const { data } = await axios.delete(`/api/v1/category/delete-category/${id}`)
            if (data.success) {
                toast.success(`${data.message}`)
                setDelVisible(false)
                setDelItem(null)
                getAllCategory()
            } else {
                toast.error(`${data.message}`)
            }
        } catch (error) {
            console.log(error)
            toast.error('Something went wrong')
        }
    }

    return (
        <Layout title={'Dashboard - Create Category'}>
            <div className='container-fluid m-3 p-3'>
                <div className='row'>
                    <div className='col-md-3'>
                        <AdminMenu />
                    </div>
                    <div className='col-md-9'>
                        <h1>Manage Category</h1>
                        <div className='p-3 w-50'>
                            <CategoryForm handleSubmit={handleSubmit} value={name} setValue={setName} />
                        </div>
                        {
                            (category.length !== 0) ?
                                <div className="w-75">
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th scope="col">Name</th>
                                                <th scope="col">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {category?.map((item) => (
                                                <tr key={item._id}>
                                                    <td>
                                                        {item.name}
                                                    </td>
                                                    <td>
                                                        <button className='btn btn-primary ms-2' onClick={() => { setVisible(true); setUpdatedName(item.name); setSelected(item) }}>Edit</button>
                                                        <button className='btn btn-danger ms-2' onClick={() => {setDelVisible(true); setDelItem(item)}}>Delete</button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                : "No category found!"
                        }
                    </div>
                    <div>
                        <Modal visible={visible} onClose={() => setVisible(false)}>
                            <CategoryForm handleSubmit={handleUpdate} value={updatedName} setValue={setUpdatedName} />
                        </Modal>
                        <Modal visible={delVisible} onClose={() => setDelVisible(false)}>
                            <DeleteConfirmation handleSubmit={()=>{handleDelete(delItem._id)}} onClose={() => setDelVisible(false)}/>
                        </Modal>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default CreateCategory