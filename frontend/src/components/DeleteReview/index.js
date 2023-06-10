import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { deleteReviewThunk, getReviewsThunk } from "../../store/reviews";
import { fetchASpot } from "../../store/spots";


const DeleteReview = ({ reviewId, spotId }) => {
    const dispatch = useDispatch();
    const { closeModal } = useModal();

    const handleSubmit = async () => {
        await dispatch(deleteReviewThunk(reviewId))
        await dispatch(getReviewsThunk(spotId))
        await dispatch(fetchASpot(spotId))
        closeModal();
    }

    return (
        <div className="deleteReviewModalDiv">
            <div className="confirmDeleteDiv">
                <h2>Confirm Delete</h2>
            </div>
            <p>Are you sure you want to delete this review?</p>
            <div className="deleteReviewModalButtonsDiv">
                <button className="deleteButton changeCursor" onClick={handleSubmit}>Yes (Delete Review)</button>
                <button className="closeButton changeCursor" onClick={closeModal}>No (Keep Review)</button>
            </div>
        </div>
    )
}

export default DeleteReview;
