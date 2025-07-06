import React, { useState, useEffect, useRef } from 'react'
import Layout from '../components/layout/Layout.js'
import { useCart } from '../context/cart.js'
import { useAuth } from '../context/auth.js'
import { useNavigate } from 'react-router-dom'
import dropin from 'braintree-web-drop-in';
import toast from 'react-hot-toast'
import axios from 'axios'

const CartPage = () => {
    const [auth, setAuth] = useAuth()
    const [cart, setCart] = useCart()
    const navigate = useNavigate()
    const [clientToken, setClientToken] = useState("")
    const [loading, setLoading] = useState(false)

    const dropinContainerRef = useRef(null);
    const dropinInstanceRef = useRef(null);

    //total price
    const totalPrice = () => {
        try {
            let total = 0
            cart?.map((item) => { total = total + item.price })
            return total.toLocaleString("en-US", {
                style: "currency",
                currency: "USD"
            })
        } catch (error) {
            console.log(error)
        }
    }

    //delete item
    const removeCartItem = (pid) => {
        try {
            let myCart = [...cart]
            let index = myCart.findIndex(item => item._id === pid)
            myCart.splice(index, 1)
            setCart(myCart)
            localStorage.setItem('cart', JSON.stringify(myCart))
        } catch (error) {
            console.log(error)
        }
    }

    //get payment gateway token
    const getToken = async () => {
        try {
            const { data } = await axios.get(`/api/v1/product/braintree/token`)
            // console.log(data)
            setClientToken(data?.clientToken)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getToken()
    }, [auth?.token])


    useEffect(() => {
        if (!clientToken) return
        dropin.create(
            {
                authorization: clientToken,
                container: dropinContainerRef.current,
            },
            (err, instance) => {
                if (err) {
                    console.log(err);
                    return;
                }
                dropinInstanceRef.current = instance;
            }
        )

        return () => {
            // if (dropinInstanceRef.current) {
            //     dropinInstanceRef.current.teardown()
            // }
        }
    }, [clientToken])


    //make payment

    
    // const handlePayment = async () => {
    //     try {
    //         setLoading(true)
    //         const nonce = await dropinInstanceRef.current.requestPaymentMethod((err, payload) => {
    //             if (err) {
    //                 console.error(err);
    //                 return;
    //             }
    //             // console.log('Payment nonce:', payload.nonce);
    //             return payload.nonce;
    //         })
    //         console.log(nonce)
    //         const { data } = await axios.post('/api/v1/product/braintree/payment', { nonce, cart })
    //         setLoading(false)
    //         localStorage.removeItem('cart')
    //         setCart([])
    //         navigate("/dashboard/user/orders")
    //         toast.success('Payment completed successfully')
    //     } catch (error) {
    //         console.log(error)
    //         setLoading(false)
    //     }
    // }

    const handlePayment = () => {
        setLoading(true);

        dropinInstanceRef.current.requestPaymentMethod((err, payload) => {
            if (err) {
                console.error('Error getting payment method:', err);
                setLoading(false);
                toast.error('Payment method request failed');
                return;
            }
            const nonce = payload.nonce;
            // console.log('Payment nonce:', nonce);
            axios.post('/api/v1/product/braintree/payment', { nonce, cart })
                .then(({ data }) => {
                    setLoading(false);
                    localStorage.removeItem('cart');
                    setCart([]);
                    navigate("/dashboard/user/orders");
                    toast.success('Payment completed successfully');
                })
                .catch(error => {
                    console.error('Payment error:', error);
                    setLoading(false);
                    toast.error('Payment failed. Try again!');
                });
        });
    };


    console.log(loading, dropinContainerRef.current, auth?.user?.address)


    return (
        <Layout>
            <div className='container'>
                <div className='row'>
                    <div className='col-md-12'>
                        <h1 className='text-center bg-light p-2 mb-1'>{`Hello ${auth?.token && auth?.user?.name}`}</h1>
                        <h4 className='text-center'>{cart?.length > 0 ? `You have ${cart?.length} items in your cart${auth?.token ? "" : ", please login to checkout."}` : "Your cart is empty"}</h4>
                    </div>
                </div>
                <div className='row'>
                    <div className='col-md-6'>
                        {cart?.map((item) => (
                            <div className='row m-2 p-3 card flex-row' key={item._id}>
                                <div className='col-md-4'>
                                    <img src={`/api/v1/product/product-photo/${item._id}`} className="card-img-top" alt={item.name} width="100px" height="100px" />
                                </div>
                                <div className='col-md-8'>
                                    <p>{item.name}</p>
                                    <p>{(item.description.length > 30) ? item.description.substring(0, 30) + "..." : item.description}</p>
                                    <p>${item.price}</p>
                                    <button className='btn btn-danger' onClick={() => removeCartItem(item._id)}>Remove</button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className='col-md-4 text-center'>
                        <h2>Cart Summary</h2>
                        <p>Total | Checkout | Payment</p>
                        <hr />
                        <h4>Total: {totalPrice()}</h4>
                        {auth?.user?.address ? (
                            <>
                                <div className='mb-3'>
                                    <h4>Current Address</h4>
                                    <h5>{auth?.user?.address}</h5>
                                    <button className='btn btn-outline-warning' onClick={() => navigate("/dashboard/user/profile")}>Update Address</button>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className='mb-3'>
                                    {
                                        auth?.token ? (
                                            <button className='btn btn-outline-warning' onClick={() => navigate('/dashboard/user/profile')}>Update Address</button>
                                        ) : (
                                            <button className='btn btn-outline-warning' onClick={() => navigate('/login', { state: '/cart' })}>Please login to checkout</button>
                                        )
                                    }
                                </div>
                            </>
                        )}
                        <div className='mt-2'>
                            {!clientToken || !auth?.token || !cart?.length ? (
                                ""
                            ) : (
                                <>
                                    <div>
                                        <div ref={dropinContainerRef}></div>
                                        <button className='btn btn-primary mb-3' onClick={handlePayment} disabled={loading || !auth?.user?.address || !clientToken}>{loading ? 'Processing...' : 'Make Payment'}</button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default CartPage