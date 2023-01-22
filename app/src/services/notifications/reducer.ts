import { INSERT_NOTIFICATION, SET_NOTIFICATIONS } from "./actionTypes"

const INITIAL_STATE = {
    notifications: []
}

export default (state = INITIAL_STATE, action: any) => {
    switch (action.type) {
        case SET_NOTIFICATIONS:
            return {
                ...state,
                notifications: action.payload
            }
        case INSERT_NOTIFICATION:
            return {
                ...state,
                notifications: [action.payload, ...state.notifications]
            }
        default:
            return state
    }
}