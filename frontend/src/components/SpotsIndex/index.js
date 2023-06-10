import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSpots } from "../../store/spots"
import './SpotsIndex.css'
import { NavLink } from "react-router-dom";

const SpotsIndex = () => {
    const spotsObj = useSelector(function (state) {
        return state.spots.allSpots
    })
    const spotsArray = Object.values(spotsObj)

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchSpots());
    }, [dispatch]);

    return (
        <div>
            {
                spotsArray.map((spot) => (
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
                                            <i className="fa-solid fa-star"></i>{(spot.avgStarRating % 1 === 0 ? (spot.avgStarRating + '.0') : Number.parseFloat(spot.avgRating).toFixed(1))}
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
    );
};

export default SpotsIndex;
