import AsyncStorage from "@react-native-async-storage/async-storage";
import _ from "lodash";
import { ReducerProps } from "..";
import { AppDispatch } from "../../../App";
import LocalStoragePaths from "../../utils/LocalStoragePaths";
import PATHS from "../../utils/PATHS";
import { setBanner } from "../banner/actions";
import { BannerTypes } from "../banner/types";
import processImage from "../utils/process-image";
import request from "../utils/request";
import saveVideos from "../utils/save-video";
import { CLEAR_WORKOUTS } from "../workout/actionTypes";
import { WorkoutProps } from "../workout/types";
import { SET_EXERCISE_VIDEO_BATCH, SET_OFFLINE, SET_ONLINE, SET_SOFTLETE_UID } from "./actionTypes";
import { ExercisesVideoBatchProps, WoImageBatchProps } from "./types";
import { saveOfflineData } from "./utils";

export const goOffline = () => async (dispatch: AppDispatch, getState: () => ReducerProps) => {
    //get the most recent up to date
    const { workouts } = getState().workout;

    try {
        await AsyncStorage.multiSet([[LocalStoragePaths.lastFetchedWos, JSON.stringify(workouts)], [LocalStoragePaths.offline, '1']])
    } catch (err) {
        dispatch(setBanner(BannerTypes.error, 'Failed to go offline. Please try again'))
    }

    dispatch({ type: SET_OFFLINE })
}

export const goOnline = (callback: (msg: string) => void) => async (dispatch: AppDispatch, getState: () => ReducerProps) => {
    //get the most recent up to date
    const { workout } = getState();

    const lastFetchedWos = await AsyncStorage.getItem(LocalStoragePaths.lastFetchedWos);

    let changes = false;

    if (lastFetchedWos) {
        const parsedWos = JSON.parse(lastFetchedWos) as WorkoutProps[];
        if (parsedWos) {
            changes = await saveOfflineData(parsedWos, workout.workouts, callback)(dispatch, getState)
        }
    }

    await AsyncStorage.multiRemove([LocalStoragePaths.lastFetchedWos, LocalStoragePaths.offline])
    dispatch({ type: CLEAR_WORKOUTS })
    dispatch({ type: SET_ONLINE })
    return changes
}

export const getGlobalVars = () => async (dispatch: AppDispatch, getState: () => ReducerProps) => {
    request("GET", PATHS.global.get, dispatch)
        .then(({ data }) => {
            if (data) {
                dispatch({
                    type: SET_SOFTLETE_UID,
                    payload: data
                })
            }
        })
}



export const processBatches = () => async (dispatch: AppDispatch, getState: () => ReducerProps) => {
    const batch = await AsyncStorage.multiGet([LocalStoragePaths.exercisesVideosBatch, LocalStoragePaths.woImageBatch])

    if (batch.length !== 2) return;

    try {

        const strBatchItems = batch[0][1];
        if (strBatchItems) {
            const batchItems = JSON.parse(strBatchItems) as ExercisesVideoBatchProps[];
            processVideoBatch(batchItems)(dispatch, getState)
        }

        const strImagesBatch = batch[1][1];
        if (strImagesBatch) {
            const batchItems = JSON.parse(strImagesBatch) as WoImageBatchProps[];
            processImageBatch(batchItems)(dispatch, getState)
        }

    } catch (err) {
        console.log(err)
    }

}

const processVideoBatch = (batch: ExercisesVideoBatchProps[]) => (dispatch: AppDispatch, getState: () => ReducerProps) => {
    if (batch.length > 0) {
        dispatch({ type: SET_EXERCISE_VIDEO_BATCH, payload: batch })
        //process batch
        for (let i = 0; i < batch.length; i++) {
            const item = batch[i];
            //I don't have to await I can compress multiple at a time
            saveVideos(item.localUrl, item.videoId, item.localThumbnail)(dispatch, getState).catch(err => console.log(err))
        }
    }
}

const processImageBatch = (batch: WoImageBatchProps[]) => (dispatch: AppDispatch, getState: () => ReducerProps) => {
    if (batch.length > 0) {
        dispatch({ type: SET_EXERCISE_VIDEO_BATCH, payload: batch })
        //process batch
        for (let i = 0; i < batch.length; i++) {
            const item = batch[i];
            //I don't have to await I can compress multiple at a time
            processImage(item.base64, item.imageId)(dispatch, getState).catch(err => console.log(err))
        }
    }
}