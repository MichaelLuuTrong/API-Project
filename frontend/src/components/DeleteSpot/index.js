import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal"
import { fetchSpots, deleteSpotThunk } from "../../store/spots"
import { useEffect } from "react";

const DeleteModal = ({ spotId }) => {
    const dispatch = useDispatch();
    const { closeModal } = useModal()

    const deletePressed = async () => {
        await dispatch(deleteSpotThunk(spotId))
        closeModal()
    }

    useEffect(() => {
        dispatch(fetchSpots())
    }, [dispatch])

    return (
        <div className="deleteModalDiv">
            <div className="confirmDelete">
                <h2>Confirm Delete</h2>
            </div>
            <div className='areYouSure'>
                <p>Are you sure you want to remove this spot from the listings?</p>
            </div>
            <div className='optionButtons'>
                <button className='deleteButton changeCursor' onClick={() => deletePressed()}>Yes (Delete Spot)</button>
                <button className='noButton changeCursor' onClick={() => closeModal()}>No (Keep Spot)</button>
            </div>

        </div>
    )
}

export default DeleteModal
