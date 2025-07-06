const CategoryForm = ({handleSubmit, value, setValue}) => {
    return (
        <>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="category" className="form-label">
                        Enter new category:
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        id="category"
                        value = {value}
                        onChange = {(e)=>{setValue(e.target.value)}}
                    />

                    <button type="submit" className="btn btn-primary mt-3">
                        Submit
                    </button>
                </div>
            </form>

        </>
    )
}

export default CategoryForm