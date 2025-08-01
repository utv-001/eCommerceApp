import { useSearch } from '../../context/search.js'
import axios from 'axios'
import {useNavigate} from 'react-router-dom'

const SearchInput = () => {
    const [values, setValues] = useSearch()
    const navigate = useNavigate()
    const baseURL = process.env.REACT_APP_API_BASE_URL
    
    const handleSubmit = async (e)=>{
        e.preventDefault()
        try{
            const {data} = await axios.get(`${baseURL}/api/v1/product/search/${values.keyword}`)
            setValues({...values, results: data})
            navigate('/search')
            console.log(values)
        }catch(error){
            console.log(error)
        }
    }

    return (
        <div>
            <form className="d-flex" role="search" onSubmit={handleSubmit}>
                <input
                    className="form-control me-2"
                    type="search"
                    placeholder="Search"
                    aria-label="Search"
                    value={values.keyword}
                    onChange={(e)=>{setValues({...values, keyword: e.target.value})}}
                />
                <button className="btn btn-outline-success" type="submit">
                    Search
                </button>
            </form>

        </div>
    )
}

export default SearchInput