import { SET_NEW_USER_STATE, SET_DEMO_STATE, SET_REGISTER, SET_ONLINE, SET_OFFLINE, SET_EXERCISE_VIDEO_BATCH, SET_WO_IMAGE_BATCH, SET_SOFTLETE_UID, SET_CONNECT_APP_STORE } from "./actionTypes"
import { SET_NOTIFICATION_TOKEN, SIGNOUT_USER } from "../user/actionTypes"

const INITIAL_STATE = {
    isNewUser: false,
    demoState: undefined,
    notificationToken: undefined,
    offline: false,
    exercisesVideoBatch: [],
    woImageBatch: [],
    softleteUid: '',
    connectAppStore: false
}

export default (state = INITIAL_STATE, action: any) => {
    switch (action.type) {
        case SET_NOTIFICATION_TOKEN:
            return {
                ...state,
                notificationToken: action.payload
            }
        case SET_NEW_USER_STATE:
            return {
                ...state,
                isNewUser: action.payload
            }
        case SET_REGISTER:
            return {
                ...state,
                register: action.payload
            }
        case SET_DEMO_STATE:
            return {
                ...state,
                demoState: action.payload
            }
        case SET_ONLINE:
            return {
                ...state,
                offline: false
            }
        case SET_OFFLINE:
            return {
                ...state,
                offline: true
            }
        case SET_EXERCISE_VIDEO_BATCH:
            return {
                ...state,
                exercisesVideoBatch: action.payload
            }
        case SET_WO_IMAGE_BATCH:
            return {
                ...state,
                woImageBatch: action.payload
            }
        case SET_SOFTLETE_UID:
            return {
                ...state,
                softleteUid: action.payload
            }
        case SET_CONNECT_APP_STORE:
            return {
                ...state,
                connectAppStore: true
            }
        case SIGNOUT_USER:
            return INITIAL_STATE;
        default:
            return state;
    }
}