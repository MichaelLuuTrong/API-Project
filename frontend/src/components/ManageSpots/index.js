import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSpots } from "../../store/spots"
import { useHistory } from "react-router"
import DeleteModal from "../DeleteSpot"
import OpenModalButton from "../OpenModalButton"
import './ManageSpots.css'


const ManageSpots = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const allSpots = useSelector(state => Object.values(state.spots.allSpots))
    const user = useSelector(state => state.session.user)

    let userSpots = [];

    useEffect(() => {
        dispatch(fetchSpots())
    }, [dispatch])


    if (!user) {
        return (history.push('/'))
    }

    allSpots.forEach(spot => {
        if (spot.ownerId === user.id) userSpots.push(spot)
    });

    return (
        <>
            <div className='headerOnly'>
                <div className='manageSpotsTitle'>
                    <h1>Manage Spots</h1>
                </div>
                <button className='createANewSpotButton' onClick={(() => history.push('/spots/new'))}>Create a New Spot</button>
            </div >
            <div className="allSpotsDiv">
                {
                    userSpots.map((spot) => (
                        <div className='indivSpotDiv' key={`spot/${spot.id}`} >
                            <div className='previewImageDiv changeCursor' onClick={() => history.push(`/spots/${spot.id}`)}>
                                <img src={spot.previewImage} alt={spot.name} className='spotPreviewImage' />
                            </div>
                            <div className='spotInfo changeCursor' onClick={() => history.push(`/spots/${spot.id}`)}>
                                <div className='locationandSpotInfo'>
                                    <div className='locationInfo'>
                                        <div key={spot.id} to={`/spots/${spot.id}`} >
                                            <div className='locationInfoText'>{spot.city}, {spot.state}</div>
                                        </div>
                                    </div>
                                    <div className='ratingInfo'>
                                        <i className="fa-solid fa-star"></i>
                                        {!spot.avgRating ? <div className='new'>New</div> :
                                            <div className='starRatingText'>
                                                {(spot.avgStarRating % 1 === 0 ? (spot.avgStarRating + '.0') : Number.parseFloat(spot.avgRating).toFixed(1))}
                                            </div>}
                                    </div>
                                </div>
                                <div className='priceInfo'>
                                    <div className='justPrice'>${spot.price}</div>
                                    <div className='justNight'>night</div>
                                </div>
                            </div>
                            <button className="updateButton changeCursor" onClick={() => history.push(`/spots/${spot.id}/edit`)}>Update</button>
                            <OpenModalButton
                                className="deleteButtonForManageSpots changeCursor"
                                modalComponent={<DeleteModal spotId={spot.id} />}
                                buttonText="Delete"
                            />
                        </div>
                    ))
                }
            </div>
        </>
    )
}

export default ManageSpots
