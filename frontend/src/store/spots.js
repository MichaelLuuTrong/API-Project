import { csrfFetch } from "./csrf"

//Action Type Constants
export const LOAD_SPOTS = "spots/LOAD_SPOTS"
export const CREATE_SPOT = "spots/CREATE_SPOT"
export const DELETE_SPOT = "spots/DELETE_SPOT"
export const UPDATE_SPOT = "spots/UPDATE_SPOT"

//Action Creators
export const loadSpots = (spots) => ({
    type: LOAD_SPOTS,
    spots,
})

//Thunk Action Creators
export const fetchSpots = () => async (dispatch) => {
    const res = await csrfFetch("/api/spots")

    if (res.ok) {
        const spots = await res.json();
        dispatch(loadSpots(spots))
    }
};

//Spots Reducer
let initialState = { allSpots: {}, singleSpot: {} }

const spotsReducer = (state = initialState, action) => {
    // console.log("state in spot reducer:", state)
    switch (action.type) {
        case LOAD_SPOTS:
            const spotsState = { allSpots: {} };
            // console.log("action.spots:", action.spots.Spots);
            action.spots.Spots.forEach((spot) => {
                spotsState.allSpots[spot.id] = spot
            });
            return spotsState
        default:
            return state
    }
};

export default spotsReducer;
