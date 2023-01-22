import request, { setAuthHeader, removeAuthHeader } from "../utils/request";
import { SIGNIN_USER, UPDATE_PROFILE, SIGNOUT_USER, SET_FRIENDS, INSERT_BLOCKED_USER, SET_SUBSCRIPTION_TYPE } from "./actionTypes";
import { UserProps, ProfileProps, FriendProps, SubscriptionProps, FriendStatus } from "./types";
import auth from '@react-native-firebase/auth';
import { AppDispatch } from "../../../App";
import { setBanner } from "../banner/actions";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ReducerProps } from "..";
import processImage from "../utils/save-image";
import _ from "lodash";
import { SET_PIN_EXERCISES } from "../misc/actionTypes";
import { updatePinExercisesWithExercises } from "../exercises/actions";
import { PinExerciseProps } from "../misc/types";
import { fetchAthleteProfiles } from "../athletes/actions";
import PATHS from "../../utils/PATHS";
import { SET_NEW_USER_STATE, SET_OFFLINE } from "../global/actionTypes";
import { BannerTypes } from "../banner/types";
import LocalStoragePaths from "../../utils/LocalStoragePaths";
import Limits from "../../utils/Limits";

export const login = (token: string) => async (dispatch: AppDispatch, getState: () => ReducerProps) => {
    //get profile
    let userProps: UserProps | undefined;

    //upon login in determine if the user has set offline
    const isOffline = await AsyncStorage.getItem(LocalStoragePaths.offline);

    if (isOffline || !token) {
        //user is offline
        const lsUserStr = await AsyncStorage.getItem(LocalStoragePaths.user);
        if (lsUserStr) {
            userProps = JSON.parse(lsUserStr);
        }

        if (userProps) {
            dispatch({ type: SIGNIN_USER, payload: userProps })
        }

        dispatch({ type: SET_OFFLINE })
        return;
    }

    //set new token as header
    setAuthHeader(token)

    const { data, networkError }: { data?: UserProps, networkError?: boolean } = await request('GET', PATHS.signin.login, dispatch);

    userProps = data;

    if (networkError) {
        dispatch(setBanner(BannerTypes.warning, "Please check your internet connection."));
        //attempt to get user local storage
        const lsUserStr = await AsyncStorage.getItem(LocalStoragePaths.user);

        if (lsUserStr) {
            userProps = JSON.parse(lsUserStr);
        }

        if (!userProps) {
            //no user found in local storage
            //sign out
            await logout()(dispatch)
            return;
        }

        dispatch({
            type: SIGNIN_USER, payload: {
                ...userProps,
                token
            }
        })

        dispatch({ type: SET_OFFLINE })
        return;
    }

    if (!userProps) {
        //new user
        dispatch({ type: SET_NEW_USER_STATE, payload: true })
        dispatch({ type: SIGNIN_USER, payload: { token: token } })
        return;
    }


    if (userProps.pinExercises) {
        //fetch all the exercises associated with
        dispatch({
            type: SET_PIN_EXERCISES,
            payload: userProps.pinExercises
        })
    }

    //don't need to store auth token in redux, it's already in the header
    dispatch({
        type: SIGNIN_USER,
        payload: {
            ...userProps,
            token: token ? token : userProps.token,
            birthDate: userProps.birthDate
        }
    })
}

export const registerUser = (username: string, name: string) => async (dispatch: AppDispatch, getState: () => ReducerProps) => {
    request("POST", PATHS.signin.register, dispatch, { name, username })
        .then(({ data }: { data?: UserProps }) => {
            const { user } = getState()
            dispatch({
                type: SIGNIN_USER,
                payload: { ...user, ...data }
            })
        })
        .catch((err) => {
            console.log(err)
        })
}

export const updateProfile = (profileProps: ProfileProps, base64: string, callback: (status: string) => void) => async (dispatch: AppDispatch, getState: () => ReducerProps) => {
    const { uid } = getState().user;

    let savedImageUri: string;

    ///save profile image
    if (base64) {
        callback('Saving image...')
        savedImageUri = await processImage(base64, `${uid}/profile/img.jpg`)(dispatch)
        if (!savedImageUri) return;
        //append image to data
        profileProps.imageUri = savedImageUri
    }

    callback('Updating profile...')

    await request('POST', PATHS.user.updateProfile, dispatch, profileProps)
        .then(({ data }) => {
            if (data) {
                dispatch({
                    type: UPDATE_PROFILE,
                    payload: data
                })
                callback('Saved!')
            } else {
                callback('Failed to update profile.')
            }
        })
        .catch(err => {
            callback('Failed to update profile.')
            console.log(err)
        })
}

export const logout = () => async (dispatch: AppDispatch) => {
    //remove auth header
    removeAuthHeader()

    //signout user
    //and clear local storage
    dispatch({ type: SIGNOUT_USER })

    auth().signOut().catch(err => {
        console.log(err)
    })

    await AsyncStorage.multiRemove([
        LocalStoragePaths.user,
        LocalStoragePaths.offlineWos,
        LocalStoragePaths.offline,
        LocalStoragePaths.lastFetchedWos
    ]).catch(err => console.log(err))
}

export const updatePinExercises = (pinProps: PinExerciseProps, pin: boolean) => async (dispatch: AppDispatch, getState: () => ReducerProps) => {
    //max length is 10
    const { pinExercises } = getState().misc;

    if (pinExercises.length >= Limits.maxPinExs && pin) {
        dispatch(setBanner(BannerTypes.warning, 'Exceeded the max limit for pinned exercises.'))
        return;
    }

    return request("POST", PATHS.user.updatePinExercises, dispatch, { pinExercise: pinProps, pin })
        .then(async ({ data }: { data?: PinExerciseProps[] }) => {
            if (data) {
                //update the data with exercise data
                data = await updatePinExercisesWithExercises(data)(dispatch, getState);

                dispatch({ type: SET_PIN_EXERCISES, payload: data })
            }
        })
        .catch((err) => {
            console.log(err)
        })
}

export const getFriends = () => async (dispatch: AppDispatch, getState: () => ReducerProps) => {
    return request("GET", PATHS.friends.getAll, dispatch)
        .then(({ data }: { data?: FriendProps[] }) => {
            if (data) {
                //This is removed to limit the amount of request ....
                //update 10/28 ... only fetch the pending status profiles
                const { uid } = getState().user;
                const uidsToFetch: string[] = [];

                data.forEach(friend => {
                    if (friend.status !== FriendStatus.denied) {
                        const otherUser = friend.users.find(fUid => fUid !== uid)
                        if (otherUser) {
                            uidsToFetch.push(otherUser)
                        }
                    }
                })

                uidsToFetch.length > 0 && fetchAthleteProfiles(uidsToFetch)(dispatch).catch(err => console.log(err))
                dispatch({ type: SET_FRIENDS, payload: data })
            }
        })
        .catch((err) => {
            console.log(err)
        })
}

export const handleSubscriptionPurchased = (transactionReceipt: string, originalOrderId: string, productId: string) => async (dispatch: AppDispatch, getState: () => ReducerProps) => {
    return request("POST", PATHS.subscription.subscribe, dispatch, { transactionReceipt, originalOrderId, productId })
        .then(({ data }: { data?: SubscriptionProps }) => {
            if (data) dispatch({ type: SET_SUBSCRIPTION_TYPE, payload: productId })
        })
        .catch((err) => {
            console.log(err)
        })
}

export const handleBlockUser = (userUid: string, block: boolean) => async (dispatch: AppDispatch, getState: () => ReducerProps) => {
    let path = '';
    if (block) {
        path = PATHS.user.unblock
    } else {
        path = PATHS.user.block
    }

    await request("POST", path, dispatch, { userUid })
        .then(({ data }: { data?: UserProps }) => {
            if (data) {
                dispatch({ type: INSERT_BLOCKED_USER, payload: data.blockUids })
            }
        })
        .catch(err => {
            console.log(err)
        })
}