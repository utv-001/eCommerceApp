import { NavLink, Link } from 'react-router-dom'
import { GiShoppingBag } from "react-icons/gi"
import { useAuth } from '../../context/auth.js'
import SearchInput from '../forms/SearchInput.js'
import toast from 'react-hot-toast'
import useCategory from '../../hooks/useCategory.js'
import { useCart } from '../../context/cart.js'
import { Badge } from 'antd'
import { MdShoppingCart } from "react-icons/md";

const Header = () => {
    const [auth, setAuth] = useAuth()
    const [cart] = useCart()
    const categories = useCategory()
    const handleLogout = () => {
        setAuth({ ...auth, user: null, token: "" })
        localStorage.removeItem('auth')
        toast.success('Logout successfull!')
    }
    return (
        <nav className="navbar navbar-expand-lg bg-body-tertiary">
            <div className="container-fluid">
                <button className="navbar-toggler"
                    type="button" data-bs-toggle="collapse"
                    data-bs-target="#navbarTogglerDemo01"
                    aria-controls="navbarTogglerDemo01"
                    aria-expanded="false"
                    aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon" />
                </button>
                <div className="collapse navbar-collapse" id="navbarTogglerDemo01">
                    <Link to="/" className="navbar-brand"><GiShoppingBag /> ECOMMERCE APP</Link>
                    <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                        <SearchInput />
                        <li className="nav-item">
                            <NavLink to="/" className="nav-link">Home</NavLink>
                        </li>
                        <li className="nav-item dropdown">
                            <Link className="nav-link dropdown-toggle" to="/categories" data-bs-toggle="dropdown"> Category </Link>
                            <ul className="dropdown-menu">
                                <li>
                                    <Link className="dropdown-item" to="/categories"> All Categories </Link>
                                </li>
                                {categories?.map((category) => (
                                    <li key={category._id}>
                                        <Link className="dropdown-item" to={`/category/${category.slug}`}> {category.name} </Link>
                                    </li>
                                ))}
                            </ul>
                        </li>
                        {
                            !auth.user ? (
                                <>
                                    <li className="nav-item">
                                        <NavLink to="/register" className="nav-link">Register</NavLink>
                                    </li>
                                    <li className="nav-item">
                                        <NavLink to="/login" className="nav-link">Log in</NavLink>
                                    </li>
                                </>) :
                                (
                                    <>
                                        <li className="nav-item dropdown">
                                            <NavLink
                                                className="nav-link dropdown-toggle"
                                                role="button"
                                                data-bs-toggle="dropdown"
                                                aria-expanded="false"
                                            >
                                                {auth?.user?.name}
                                            </NavLink>
                                            <ul className="dropdown-menu">
                                                <li>
                                                    <NavLink className="dropdown-item" to={`/dashboard/${auth?.user?.role === 1 ? 'admin' : 'user'}`}>Dashboard</NavLink>
                                                </li>
                                                <li>
                                                    <NavLink onClick={handleLogout} to="/login" className="dropdown-item">Logout</NavLink>
                                                </li>
                                            </ul>
                                        </li>
                                    </>
                                )
                        }
                        <li className="nav-item">
                            <NavLink to="/cart" className="nav-link">
                                <Badge count={cart?.length} showZero>
                                    <MdShoppingCart size={'20'}/>
                                </Badge>
                            </NavLink>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    )
}

export default Header;