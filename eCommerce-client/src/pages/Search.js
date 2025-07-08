import Layout from '../components/layout/Layout.js'
import { useSearch } from '../context/search'

const Search = ()=>{
    const [values, setValues] = useSearch()
    const baseURL = process.env.REACT_APP_API_BASE_URL
    return(
        <Layout title={'Search results'}>
            <div className='container'>
                <div className='text-center'>
                    <h1>Search Results</h1>
                    <h6>{values?.results.length < 1 ? 'No Products Found' : `found ${values?.results.length}`}</h6>
                    <div className='d-flex flex-wrap mt-4'>
                        {values?.results?.map((item) => (
                            <div className="card m-2" key={item._id} style={{ width: "18rem" }}>
                                <img src={`${baseURL}/api/v1/product/product-photo/${item._id}`} className="card-img-top" alt={item.name} />
                                <div className="card-body">
                                    <h5 className="card-title">{item.name}</h5>
                                    <p className="card-text">{(item.description.length > 30) ? item.description.substring(0, 30) + "..." : item.description}</p>
                                    <p className="card-text"> $ {item.price}</p>
                                    <button className='btn btn-primary ms-1'>More Details</button>
                                    <button className='btn btn-secondary ms-1'>Add to Cart</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default Search