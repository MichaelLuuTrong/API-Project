import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSpots } from "../../store/spots"
import './SpotsIndex.css'
import { useHistory } from "react-router-dom";

const SpotsIndex = () => {
    const spotsObj = useSelector(function (state) {
        return state.spots.allSpots
    })
    const spotsArray = Object.values(spotsObj)

    const dispatch = useDispatch();

    const history = useHistory();

    useEffect(() => {
        dispatch(fetchSpots());
    }, [dispatch]);

    return (
        <div className="allSpotsDiv">
            {
                spotsArray.map((spot) => (
                    <div className='indivSpotDiv changeCursor' title={spot.name} key={`spot/${spot.id}`}>
                        <div className='previewImageDiv' onClick={() => history.push(`/spots/${spot.id}`)}>
                            <img src={spot.previewImage} alt={spot.name} className='spotPreviewImage' />
                        </div>
                        <div className='spotInfo'>
                            <div className='locationandSpotInfo' onClick={() => history.push(`/spots/${spot.id}`)}>
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
                    </div>
                ))
            }
        </div>
    );
};

export default SpotsIndex;
