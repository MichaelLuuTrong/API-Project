import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../../context/Modal";
import { createReviewThunk } from "../../store/reviews";
import "./ReviewFormModal.css";
import { fetchASpot } from "../../store/spots";

const ReviewFormModal = ({ spotId }) => {
    const dispatch = useDispatch();
    const [review, setReview] = useState("");
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [errors, setErrors] = useState({});
    const [isSubmitted, setIsSubmitted] = useState(false);
    const { closeModal } = useModal();
    const user = useSelector((state) => state.session.user);

    useEffect(() => {
        const errors = {};
        if (rating < 1) errors.rating = "Star Rating must be atleast 1 star.";
        if (review.length < 10)
            errors.review = "Review must have atleast 10 characters.";
        setErrors(errors);
    }, [rating, review]);

    const User = {
        firstName: user.firstName,
        lastName: user.lastName,
        id: user.id,
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitted(true);
        if (Object.values(errors).length < 1) {
            const newReviewResponses = {
                review,
                stars: rating,
            };
            dispatch(createReviewThunk(newReviewResponses, spotId, User))
                .then(() => closeModal())
                .then(() => dispatch(fetchASpot(spotId)))
        }
    };

    return (
        <div className="createReviewModalDiv">
            <div className="createReviewText">
                <h2>How was your stay?</h2>
            </div>
            {errors.rating && (
                <p className={isSubmitted ? "errors-shown" : "errors-hidden"}>
                    {errors.rating}
                </p>
            )}
            {errors.review && (
                <p className={isSubmitted ? "errors-shown" : "errors-hidden"}>
                    {errors.review}
                </p>
            )}
            <form onSubmit={handleSubmit}>
                <div className="createReviewFormDiv">
                    <textarea
                        onChange={(e) => setReview(e.target.value)}
                        value={review}
                        placeholder="Leave your review here..."
                    ></textarea>
                    <div className="createReviewRating"></div>
                    <div className="createReviewDiv">
                        <button
                            type="button"
                            className={hoverRating >= 1 || rating >= 1 ? "solid" : "empty"}
                            onMouseEnter={() => setHoverRating(1)}
                            onMouseLeave={() => setHoverRating(0)}
                            onClick={() => setRating(1)}
                        >
                            <i
                                className={
                                    hoverRating >= 1 || rating >= 1
                                        ? "fa-solid fa-star star changeCursor"
                                        : "fa-regular fa-star star changeCursor"
                                }
                            ></i>
                        </button>
                        <button
                            type="button"
                            className={hoverRating >= 2 || rating >= 2 ? "solid" : "empty"}
                            onMouseEnter={() => setHoverRating(2)}
                            onMouseLeave={() => setHoverRating(0)}
                            onClick={() => setRating(2)}
                        >
                            <i
                                className={
                                    hoverRating >= 2 || rating >= 2
                                        ? "fa-solid fa-star star changeCursor"
                                        : "fa-regular fa-star star changeCursor"
                                }
                            ></i>
                        </button>
                        <button
                            type="button"
                            className={hoverRating >= 3 || rating >= 3 ? "solid" : "empty"}
                            onMouseEnter={() => setHoverRating(3)}
                            onMouseLeave={() => setHoverRating(0)}
                            onClick={() => setRating(3)}
                        >
                            <i
                                className={
                                    hoverRating >= 3 || rating >= 3
                                        ? "fa-solid fa-star star changeCursor"
                                        : "fa-regular fa-star star changeCursor"
                                }
                            ></i>
                        </button>
                        <button
                            type="button"
                            className={hoverRating >= 4 || rating >= 4 ? "solid" : "empty"}
                            onMouseEnter={() => setHoverRating(4)}
                            onMouseLeave={() => setHoverRating(0)}
                            onClick={() => setRating(4)}
                        >
                            <i
                                className={
                                    hoverRating >= 4 || rating >= 4
                                        ? "fa-solid fa-star star changeCursor"
                                        : "fa-regular fa-star star changeCursor"
                                }
                            ></i>
                        </button>
                        <button
                            type="button"
                            className={hoverRating >= 5 || rating >= 5 ? "solid" : "empty"}
                            onMouseEnter={() => setHoverRating(5)}
                            onMouseLeave={() => setHoverRating(0)}
                            onClick={() => setRating(5)}
                        >
                            <i
                                className={
                                    hoverRating >= 5 || rating >= 5
                                        ? "fa-solid fa-star star changeCursor"
                                        : "fa-regular fa-star star changeCursor"
                                }
                            ></i>
                        </button>
                        <p>Stars</p>
                    </div>
                </div>
                <button className={Object.values(errors).length > 0 ? 'disabledSubmitButton' : 'submitButton changeCursor'} type="submit" disabled={Object.values(errors).length > 0}>
                    Submit Your Review
                </button>
            </form>
        </div>
    );
};
export default ReviewFormModal;
