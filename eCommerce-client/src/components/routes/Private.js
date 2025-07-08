import {useState, useEffect} from 'react'
import {useAuth} from '../../context/auth.js'
import {Outlet} from 'react-router-dom'
import Spinner from '../Spinner.js'
import axios from 'axios'

export default function PrivateRoute(){
    const [ok, setOk] = useState(false)
    const [auth, setAuth] = useAuth()
    const baseURL = process.env.REACT_APP_API_BASE_URL
    useEffect(()=>{
        const authCheck = async ()=>{
            const response = await axios.get(`${baseURL}/api/v1/auth/user-auth`)
            if(response.data.ok){
                setOk(true)
            }else{
                setOk(false)
            }
        }
        if(auth?.token){
            authCheck()
        }
    }, [auth?.token])

    return ok ? <Outlet/> : <Spinner/>
}