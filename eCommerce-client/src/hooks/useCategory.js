import {useState, useEffect} from 'react'
import axios from 'axios'

export default function useCategory(){
    const [categories, setCategories] = useState([])
    const baseURL = process.env.REACT_APP_API_BASE_URL
    //get categories
    const getCategories = async ()=>{
        try{
            const {data} = await axios.get(`${baseURL}/api/v1/category/all-categories`)
            setCategories(data?.category)
        }catch(error){
            console.log(error)
        }
    }

    useEffect(()=>{getCategories()}, [])

    return categories
}