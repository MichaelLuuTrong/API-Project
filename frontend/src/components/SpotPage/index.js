import { useParams } from "react-router-dom";
import { fetchASpot } from "../../store/spots";
import { useDispatch, useSelector } from "react-redux"
import { useEffect } from "react";

const SpotPage = () => {
    const { spotId } = useParams()

    const spotObj = useSelector(function (state) {
        console.log("state in SpotPage:", state)
        return state
    })

    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(fetchASpot(spotId));
    }, [dispatch, spotId]);

    return (
        <div></div>
    )
}

export default SpotPage;
