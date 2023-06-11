import { useParams } from "react-router-dom";
import { fetchASpot } from "../../store/spots";
import { useDispatch, useSelector } from "react-redux"
import { useEffect } from "react";
import ReviewsForSpot from "../ReviewsForSpot";
import { getReviewsThunk } from "../../store/reviews";
import OpenModalButton from "../OpenModalButton"
import ReviewFormModal from "../ReviewFormModal"
import './SpotPage.css'



const SpotPage = () => {
    const dispatch = useDispatch()
    const { spotId } = useParams()
    const spotObj = useSelector((state) => state.spots.singleSpot)
    const user = useSelector(state => state.session.user)
    const reviews = useSelector(state => Object.values(state.reviews));

    useEffect(() => {
        dispatch(fetchASpot(spotId));
        dispatch(getReviewsThunk(spotId))
    }, [dispatch, spotId]);

    if (!spotObj) return null
    if (!spotObj.SpotImages) return null

    const clickReserve = (e) => {
        e.preventDefault();
        window.alert('Feature Coming Soon')
    }

    const placeholderImage = "https://t3.ftcdn.net/jpg/02/48/42/64/360_F_248426448_NVKLywWqArG2ADUxDq6QprtIzsF82dMF.jpg"

    let usersWithReview = [];

    for (let i = 0; i < reviews.length; i++) {
        usersWithReview.push(reviews[i].User.id)
    }
    return (
        <div className='singleSpotPage'>
            <div className='spotHeaderInfo'>
                <h1>{spotObj.name}</h1>
                <p>{spotObj.city}, {spotObj.state}, {spotObj.country}</p>
            </div>
            <div className='picturesDiv'>
                <div className='leftPicturesDiv'>
                    <img src={spotObj.SpotImages[0] ? spotObj.SpotImages[0].url : placeholderImage} alt='large spot previw' className='leftSpotImg' />
                </div>
                <div className='rightPicturesDiv'>
                    <div className='rightPicturesTopDiv'>
                        <img src={spotObj.SpotImages[1] ? spotObj.SpotImages[0].url : placeholderImage} alt='small spot preview' className='rightSpotImg' />
                        <img src={spotObj.SpotImages[2] ? spotObj.SpotImages[0].url : placeholderImage} alt='small spot preview' className='rightSpotImg' />
                    </div>
                    <div className='rightPicturesBottomDiv'>
                        <img src={spotObj.SpotImages[3] ? spotObj.SpotImages[0].url : placeholderImage} alt='small spot preview' className='rightSpotImg' />
                        <img src={spotObj.SpotImages[4] ? spotObj.SpotImages[0].url : placeholderImage} alt='small spot preview' className='rightSpotImg' />
                    </div>
                </div>
            </div>
            <div className='bodySpotInfo'>
                <div className='hostAndSpotInfoAndReservationBubble'>
                    <div className='ownerAndSpotInfo'>
                        <h2>Hosted by {spotObj.Owner.firstName} {spotObj.Owner.lastName}</h2>
                        <p>{spotObj.description}</p>
                    </div>
                    <div className='reservationDiv'>
                        <div className='reservationWithoutButton'>
                            <div className='priceAndNight'>
                                <h3>${spotObj.price} night</h3>
                            </div>
                            {!spotObj.avgStarRating ?
                                <div className='newSpot'>
                                    <div className='justStar'><i className="fa-solid fa-star"></i></div>
                                    <h3>New</h3>
                                </div>
                                :
                                < div className='reviewedSpot'>
                                    <div className='justStar'><i className="fa-solid fa-star"></i></div>
                                    <div className='justRating'>{spotObj.avgStarRating % 1 === 0 ? (spotObj.avgStarRating + '.0') : Number.parseFloat(spotObj.avgStarRating).toFixed(1)}</div>
                                    <div className='justDot'>•</div>
                                    {spotObj.numReviews === 1 &&
                                        <div className='oneReview'>{spotObj.numReviews} review</div>
                                    }
                                    {spotObj.numReviews > 1 &&
                                        <div className='multipleReviews'>{spotObj.numReviews} reviews</div>
                                    }
                                </div>}
                        </div>
                        <div className='justReserveButton'>
                            <button onClick={clickReserve} className='reservationButton'>Reserve</button>
                        </div >
                    </div>

                </div>

                <div className='reviewsDiv'>
                    <div className='ratingNumber'>
                        <div className="ratingNumberWithoutPost">
                            <h4><i className="fa-solid fa-star shiftUp"></i></h4>
                            <h4 className="ratingItself">{spotObj.avgStarRating === null ? 'New' : (spotObj.avgStarRating % 1 === 0 ? (spotObj.avgStarRating + '.0') : Number.parseFloat(spotObj.avgStarRating).toFixed(1))}</h4>
                            <h4 className='dotHeader'>{spotObj.avgStarRating !== null ? '•' : null}</h4>
                            {spotObj.numReviews === 1 &&
                                <h4 className='oneReviewHeader'>{spotObj.numReviews} review</h4>
                            }
                            {spotObj.numReviews > 1 &&
                                <h4 className='multipleReviewsHeader'>{spotObj.numReviews} reviews</h4>
                            }
                        </div>
                        <div className='justReviewButton'>
                            {user && (user.id !== spotObj.ownerId && !usersWithReview.includes(user.id)) &&
                                <div className="reviewPostDiv">
                                    <OpenModalButton
                                        className="reviewPostButton changeCursor"
                                        modalComponent={<ReviewFormModal spotId={spotId} />}
                                        buttonText="Post Your Review"
                                    />
                                </div>
                            }
                        </div>
                        {user && (!spotObj.numReviews && (user.id !== spotObj.ownerId && !usersWithReview.includes(user.id))) && <p>Be the first to post a review!</p>}
                    </div>
                    <div className='eachReview'>
                        <ReviewsForSpot spotId={spotId} />
                    </div>
                </div>
            </div>
        </div >
    )
}

export default SpotPage;
