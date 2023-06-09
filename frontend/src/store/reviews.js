import { csrfFetch } from "./csrf";

//Action Type Constants
export const GET_REVIEWS = "reviews/GET_REVIEWS";
export const CREATE_REVIEW = "reviews/CREATE_REVIEW";
export const DELETE_REVIEW = "reviews/DELETE_REVIEWS";

export const getReviewsAction = (reviews) => ({
    type: GET_REVIEWS,
    reviews
});

export const createReviewAction = (newReview) => ({
    type: CREATE_REVIEW,
    newReview
});

export const deleteReviewAction = (reviewId) => ({
    type: DELETE_REVIEW,
    reviewId
})

//Thunk Action Creators
export const getReviewsThunk = (spotId) => async (dispatch) => {
    const res = await csrfFetch(`/api/spots/${spotId}/reviews`);

    if (res.ok) {
        const reviews = await res.json();
        await dispatch(getReviewsAction(reviews));
        return reviews;

    }
    else {
        const errors = await res.json();
        return errors;
    }
}

export const createReviewThunk = (newReviewResponses, spotId) => async (dispatch) => {
    const res = await csrfFetch(`api/spots/${spotId}/reviews`, {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newReviewResponses)
    });

    if (res.ok) {
        const newReview = await res.json();
        dispatch(createReviewAction(newReview));
        const reviews = await dispatch(getReviewsThunk(spotId));
        return reviews;
    } else {
        const errors = await res.json();
        return errors;
    }
}

export const deleteReviewThunk = (reviewId) => async (dispatch) => {
    const res = await csrfFetch(`/api/reviews/${reviewId}`, {
        method: "DELETE"
    });

    if (res.ok) {
        dispatch(deleteReviewAction(reviewId));
    } else {
        const errors = await res.json();
        return errors;
    }
}

//Reviews Reducer
const reviewsReducer = (state = {}, action) => {
    switch (action.type) {
        case GET_REVIEWS:
            const reviews = {};
            action.reviews.Reviews.forEach(review => reviews[review.id] = review);
            return reviews;
        case CREATE_REVIEW:
            const reviewStateForCreate = { ...state };
            reviewStateForCreate[action.newReview.id] = action.newReview;
            return reviewStateForCreate
        case DELETE_REVIEW:
            const reviewStateForDelete = { ...state };
            delete reviewStateForDelete[action.reviewId]
            return reviewStateForDelete
        default:
            return state
    }
}

export default reviewsReducer
