import { csrfFetch } from "./csrf"

//Action Type Constants
export const LOAD_SPOTS = "spots/LOAD_SPOTS"
export const LOAD_A_SPOT = "spots/LOAD_A_SPOT"
export const CREATE_SPOT = "spots/CREATE_SPOT"
export const DELETE_SPOT = "spots/DELETE_SPOT"
export const UPDATE_SPOT = "spots/UPDATE_SPOT"

//Action Creators
export const loadSpots = (spots) => ({
    type: LOAD_SPOTS,
    spots,
})

export const loadASpot = (singleSpot) => ({
    type: LOAD_A_SPOT,
    singleSpot
})

//Thunk Action Creators
//all spots action creator
export const fetchSpots = () => async (dispatch) => {
    const res = await csrfFetch("/api/spots")

    if (res.ok) {
        const spots = await res.json();
        dispatch(loadSpots(spots))
    }
};

//single spot action creator
export const fetchASpot = (spotId) => async (dispatch) => {
    const res = await csrfFetch(`/api/spots/${spotId}`)

    if (res.ok) {
        const spotDetails = await res.json();
        dispatch(loadASpot(spotDetails))
    }
}

//Spots Reducer
let initialState = { allSpots: {}, singleSpot: {} }
const spotsReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOAD_SPOTS:
            const spotsState = { allSpots: {} };
            action.spots.Spots.forEach((spot) => {
                spotsState.allSpots[spot.id] = spot
            });
            return spotsState
        case LOAD_A_SPOT:
            return { ...state, singleSpot: action.singleSpot }
        default:
            return state
    }
}


export default spotsReducer;
