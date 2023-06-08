import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSpots } from "../../store/spots"
import { NavLink } from "react-router-dom";

import { useHistory } from "react-router"


const ManageSpots = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const user = useSelector(state => state.session.user)
    const allSpots = useSelector(state => Object.values(state.spots.allSpots))

    let userSpots = [];
    useEffect(() => {
        dispatch(fetchSpots())
    }, [dispatch])

    allSpots.forEach(spot => {
        if (spot.ownerId === user.id) userSpots.push(spot)
    });

    return (
        <div className="manageSpots">
            < div className="manageSpotsHeader">
                <h1>Manage Your Spots</h1>
                <button onClick={(() => history.push('/spots/new'))}>Create a New Spot</button>
            </div >
            <div>
                {
                    userSpots.map((spot) => (
                        <div className='indivSpotDiv' key={`spot/${spot.id}`}>
                            <div className='previewImageDiv'>
                                <img src={spot.previewImage} alt={spot.name} className='spotPreviewImage' />
                            </div>
                            <div className='spotInfo'>
                                <div className='locationInfo'>
                                    <NavLink key={spot.id} to={`/spots/${spot.id}`} >
                                        <p>{spot.city}, {spot.state}</p>
                                    </NavLink>
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
                        </div>
                    ))
                }
            </div>
        </div>
    )

}

export default ManageSpots
