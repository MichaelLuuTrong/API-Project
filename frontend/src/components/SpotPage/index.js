import { useParams } from "react-router-dom";
import { fetchASpot } from "../../store/spots";
import { useDispatch, useSelector } from "react-redux"
import { useEffect } from "react";

const SpotPage = () => {
    const { spotId } = useParams()
    const spotObj = useSelector((state) => state.spots.singleSpot)
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(fetchASpot(spotId));
    }, [dispatch, spotId]);

    const clickReserve = (e) => {
        e.preventDefault();
        window.alert('Feature Coming Soon')
    }

    const placeholderImage = "https://t3.ftcdn.net/jpg/02/48/42/64/360_F_248426448_NVKLywWqArG2ADUxDq6QprtIzsF82dMF.jpg"

    if (!spotObj) return null
    if (!spotObj.SpotImages) return null

    return (
        <div className='singleSpotPage'>
            <div className='spotHeaderInfo'>
                <h1>{spotObj.name}</h1>
                <p>{spotObj.city}, {spotObj.state}, {spotObj.country}</p>
            </div>
            <div className='picturesDiv'>
                <div>
                    <img src={spotObj.SpotImages[0] ? spotObj.SpotImages[0].url : placeholderImage} alt='main spot preview' className='bigLeftPicture' />
                </div>
                <div className='rightPicturesDiv'>
                    <img src={spotObj.SpotImages[1] ? spotObj.SpotImages[0].url : placeholderImage} alt='additional spot previews' className='smallRightPicture' />
                    <img src={spotObj.SpotImages[2] ? spotObj.SpotImages[0].url : placeholderImage} alt='additional spot previews' className='smallRightPicture' />
                    <img src={spotObj.SpotImages[3] ? spotObj.SpotImages[0].url : placeholderImage} alt='additional spot previews' className='smallRightPicture' />
                    <img src={spotObj.SpotImages[4] ? spotObj.SpotImages[0].url : placeholderImage} alt='additional spot previews' className='smallRightPicture' />
                </div>
            </div>
            <div className='bodySpotInfo'>
                <div className='hostAndSpotInfo'>
                    <h2>Hosted by {spotObj.Owner.firstName} {spotObj.Owner.lastName}</h2>
                    <p>{spotObj.description}</p>
                </div>
                <div className='reservationDiv'>
                    <div>
                        <p>${spotObj.price} night</p>
                    </div>
                    {!spotObj.avgStarRating ?
                        <div className='newSpot'>
                            <i className="fa-solid fa-star"></i>
                            <h3>New</h3>
                        </div>
                        :
                        < div className='reviewedSpot'>
                            <h3><i className="fa-solid fa-star"></i> {spotObj.avgStarRating} • INSERT REVIEW NUM HERE</h3>
                        </div>}
                    <div>
                        <button onClick={clickReserve} className='reservationButton'>Reserve</button>
                    </div>
                </div>
            </div>

        </div >
    )
}

export default SpotPage;
