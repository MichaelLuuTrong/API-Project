const SpotIndexItem = ({ spot }) => {
    return (
        <div>
            <img src={spot.previewImage} alt='{spot.name}' />
            <div>
                {spot.city}, {spot.state}
                <i className="fa-solid fa-star"></i> {spot.avgRating}
                ${spot.price} night
            </div>
        </div>
    )
}

export default SpotIndexItem
