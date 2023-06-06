import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSpots } from "../../store/spots"
import SpotIndexItem from "../SpotIndexItem"

const SpotsIndex = () => {
    const spotsObj = useSelector(function (state) {
        // console.log("state in SpotsIndex:", state)
        return state.spots.allSpots
    })
    const spotsArray = Object.values(spotsObj)

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchSpots());
    }, [dispatch]);
    return (
        <section>
            <ul>
                {spotsArray.map((spot) => (
                    <SpotIndexItem spot={spot} key={spot.id} />
                ))}
            </ul>
        </section>
    );
};

export default SpotsIndex;
