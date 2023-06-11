import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getReviewsThunk } from "../../store/reviews"
import './ReviewsForSpot.css'
import OpenModalButton from "../OpenModalButton"
import DeleteReview from "../DeleteReview"

const ReviewsForSpot = ({ spotId }) => {
    const dispatch = useDispatch();
    const reviews = useSelector(state => Object.values(state.reviews || {}))
    const user = useSelector(state => state.session.user)

    useEffect(() => {
        dispatch(getReviewsThunk(spotId))
    }, [dispatch, spotId])

    function timestampToMonth(timestamp) {
        //2023-06-05T17:51:29.000Z
        const splitDate = timestamp.split('T')[0];
        const splitSplitDate = splitDate.split('-');
        const month = splitSplitDate[1];
        // console.log('year:', year)
        // console.log('month:', month)
        // console.log('day:', day)
        if (month === '01') return "January";
        if (month === '02') return "February";
        if (month === '03') return "March";
        if (month === '04') return "April";
        if (month === '05') return "May";
        if (month === '06') return "June";
        if (month === '07') return "July";
        if (month === '08') return "August";
        if (month === '09') return "September";
        if (month === '10') return "October";
        if (month === '11') return "November";
        if (month === '12') return "December";
    }

    function timestampToYear(timestamp) {
        //2023-06-05T17:51:29.000Z
        const splitDate = timestamp.split('T')[0];
        const splitSplitDate = splitDate.split('-');
        const year = splitSplitDate[0];
        return year
    }

    reviews.sort((spot1, spot2) => {
        const spot1CreatedAt = new Date(spot1.createdAt).getTime();
        const spot2CreatedAt = new Date(spot2.createdAt).getTime();
        if (spot1CreatedAt > spot2CreatedAt) return -1;
        if (spot1CreatedAt < spot2CreatedAt) return 1;
        else return 0;
    })

    if (Object.keys(reviews).length) {
        return (
            <div className='spotReviews'>
                {reviews.map(review =>
                    <div className='indivReview' key={review.id}>
                        <h3 className='reviewUser'>{review.User.firstName}</h3>
                        <h4 className='reviewDate'>{timestampToMonth(review.createdAt)} {timestampToYear(review.createdAt)}</h4>
                        <div className='reviewText'>{review.review}</div>
                        {user && (user.id === review.User.id) &&
                            <OpenModalButton
                                cName={'deleteReviewButton changeCursor'}
                                modalComponent={<DeleteReview reviewId={review.id} spotId={spotId} />}
                                buttonText="Delete"
                            />}
                    </div>
                )}
            </div>

        )
    }



}

export default ReviewsForSpot
