import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getReviewsThunk } from "../../store/reviews"
import 'ReviewsForSpot.css'

const Reviews = ({ spotId }) => {
    const dispatch = useDispatch();
    const reviews = useSelector(state => Object.values(state.reviews))
    const user = useSelector(state => state.session.user)

    useEffect(() => {
        dispatch(getReviewsThunk(spotId))
    }, [dispatch, spotId])






}
