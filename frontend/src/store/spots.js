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

export const createASpot = (singleSpot) => ({
    type: CREATE_SPOT,
    singleSpot
})

//Thunk Action Creators
export const fetchSpots = () => async (dispatch) => {
    const res = await csrfFetch("/api/spots")

    if (res.ok) {
        const spots = await res.json();
        dispatch(loadSpots(spots))
    }
};

export const fetchASpot = (spotId) => async (dispatch) => {
    const res = await csrfFetch(`/api/spots/${spotId}`)

    if (res.ok) {
        const spotDetails = await res.json();
        dispatch(loadASpot(spotDetails))
    }
}

export const createSpot = (nonImageResponses, imageResponses) => async (dispatch) => {
    //POST spots
    const responseWithoutImages = await csrfFetch('/api/spots',
        {
            method: 'POST',
            header: { 'Content-Type': 'application/json' },
            body: JSON.stringify(nonImageResponses)
        })
    const spotWithoutImages = await responseWithoutImages.json();

    //POST /spots/:spotId/images
    for (let imageurl of imageResponses) {
        let imageObject = {
            url: imageurl,
            preview: true
        }
        await csrfFetch(`api/spots/${spotWithoutImages.id}/images`, {
            method: 'POST',
            header: { 'Content-Type': 'application/json' },
            body: JSON.stringify(imageObject)
        })
        const responseWithImages = await csrfFetch(`api/spots/${spotWithoutImages.id}`);
        dispatch(createASpot(responseWithImages.json()))
        return responseWithImages.json
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
        case CREATE_SPOT:
            return { ...state, singleSpot: action.singleSpot, allSpots: action.singleSpot }
        default:
            return state
    }
}


export default spotsReducer;
