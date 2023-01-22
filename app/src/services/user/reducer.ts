import AsyncStorage from '@react-native-async-storage/async-storage'
import { SIGNIN_USER, SIGNOUT_USER, UPDATE_PROFILE, UPDATE_PROFILE_IMAGE, SET_FRIENDS, INSERT_FRIENDS, SET_NOTIFICATION_TOKEN, INSERT_BLOCKED_USER, SET_SUBSCRIPTION_TYPE } from './actionTypes';
import { SET_PIN_EXERCISES } from '../misc/actionTypes';
import _ from 'lodash';
import { REMOVE_EXERCISE } from '../exercises/actionTypes';
import { PinExerciseProps } from '../misc/types';
import LocalStoragePaths from '../../utils/LocalStoragePaths';

const INITIAL_STATE = {
    name: '',
    uid: '',
    email: '',
    birthDate: undefined,
    username: '',
    athlete: '',
    bio: '',
    isPrivate: false,
    pinExercises: [],
    friends: [],
    notificationToken: undefined,
    blockUids: [],
    subscriptionType: '',
}

type ActionProps = {
    type: any
    payload?: any
}


export default (state = INITIAL_STATE, action: ActionProps) => {
    switch (action.type) {
        case SIGNIN_USER:
            //store base information in local storage
            AsyncStorage.setItem(LocalStoragePaths.user, JSON.stringify(action.payload)).catch(err => console.log(err))
            return {
                ...state,
                ...action.payload,
            }
        case SIGNOUT_USER:
            //clear local storage
            AsyncStorage.removeItem(LocalStoragePaths.user).catch(err => console.log(err))
            return INITIAL_STATE
        case UPDATE_PROFILE:
            const updatedState = {
                ...state,
                ...action.payload
            }
            AsyncStorage.setItem(LocalStoragePaths.user, JSON.stringify(updatedState)).catch(err => console.log(err))
            return updatedState
        case UPDATE_PROFILE_IMAGE:
            return {
                ...state,
                ...action.payload
            }
        case SET_SUBSCRIPTION_TYPE:
            return {
                ...state,
                subscriptionType: action.payload,
                subscriptionUpdate: new Date().toISOString()
            }
        case SET_PIN_EXERCISES:
            return {
                ...state,
                pinExercises: action.payload
            }
        case SET_FRIENDS:
            return {
                ...state,
                friends: action.payload
            }
        case INSERT_FRIENDS:
            return {
                ...state,
                friends: _.uniqBy([...action.payload, ...state.friends], '_id')
            }
        case REMOVE_EXERCISE:
            return {
                ...state,
                pinExercises: _.remove(state.pinExercises, (e: PinExerciseProps) => e.exerciseUid !== action.payload._id)
            }
        case SET_NOTIFICATION_TOKEN:
            return {
                ...state,
                notificationToken: action.payload
            }
        case INSERT_BLOCKED_USER:
            return {
                ...state,
                blockUids: action.payload
            }
        default:
            return state
    }
}