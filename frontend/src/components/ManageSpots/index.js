import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSpots } from "../../store/spots"
import { useHistory } from "react-router"
import DeleteModal from "../DeleteSpot"
import OpenModalButton from "../OpenModalButton"


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
        <div className="manageSpots">
            < div className="manageSpotsHeader">
                <h1>Manage Spots</h1>
                <button onClick={(() => history.push('/spots/new'))}>Create a New Spot</button>
            </div >
            <div>
                {
                    userSpots.map((spot) => (
                        <div className='indivSpotDiv' key={`spot/${spot.id}`} >
                            <div className='previewImageDiv' onClick={() => history.push(`/spots/${spot.id}`)}>
                                <img src={spot.previewImage} alt={spot.name} className='spotPreviewImage' />
                            </div>
                            <div className='spotInfo' onClick={() => history.push(`/spots/${spot.id}`)}>
                                <div className='locationInfo'>
                                    <div key={spot.id} to={`/spots/${spot.id}`} >
                                        <p>{spot.city}, {spot.state}</p>
                                    </div>
                                    <div>
                                        {!spot.avgRating ? "New" :
                                            <div><p>
                                                <i className="fa-solid fa-star"></i>{Number.parseFloat(spot.avgRating).toFixed(1)}
                                            </p></div>}
                                    </div>
                                </div>
                                <div className='priceInfo'>
                                    <p>${spot.price} night</p>
                                </div>
                            </div>
                            <button className="updateButton changeCursor" onClick={() => history.push(`/spots/${spot.id}/edit`)}>Update</button>
                            <OpenModalButton
                                cName="deleteButton changeCursor"
                                modalComponent={<DeleteModal spotId={spot.id} />}
                                buttonText="Delete"
                            />
                        </div>
                    ))
                }
            </div>
        </div>
    )

}

export default ManageSpots
