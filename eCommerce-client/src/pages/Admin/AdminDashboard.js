import Layout from '../../components/layout/Layout.js'
import AdminMenu from '../../components/layout/AdminMenu.js'
import { useAuth } from '../../context/auth.js'

const AdminDashboard = () => {
    const [auth] = useAuth()
    return (
        <Layout title={"Admin Dashboard - Trivikram's Ecommerce App"}>
            <div className='container-fluid m-3 p-3'>
                <div className='row'>
                    <div className="col-md-3">
                        <AdminMenu />
                    </div>
                    <div className="col-md-9">
                        <div className='card w-75 p-3'>
                            <h3>Admin Name: {auth?.user?.name}</h3>
                            <h3>Admin Email: {auth?.user?.email}</h3>
                            <h3>Admin Contact: {auth?.user?.phone}</h3>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default AdminDashboard