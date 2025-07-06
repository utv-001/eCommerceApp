export default function DeleteConfirmation({handleSubmit, onClose}){
    return(
        <div className='container text-center p-2'>
            <h5 className='mb-3'>Would you like to delete?</h5>
            <div className='row justify-content-evenly'>
                <button className='btn btn-danger col-3' onClick={handleSubmit}>Yes</button>
                <button className='btn btn-primary col-3' onClick={onClose}>No</button>
            </div>
        </div>
    )
}