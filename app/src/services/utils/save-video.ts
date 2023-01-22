import storage from '@react-native-firebase/storage';
import { AppDispatch } from '../../../App';
//@ts-ignore
import { ProcessingManager } from 'react-native-video-processing';
import request from './request';
import PATHS from '../../utils/PATHS';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LocalStoragePaths from '../../utils/LocalStoragePaths';
import { ReducerProps } from '..';
import _ from 'lodash';
import { ExercisesVideoBatchProps } from '../global/types';
import { SET_EXERCISE_VIDEO_BATCH } from '../global/actionTypes';
import { NotificationProps, NotificationTypes } from '../notifications/types';
import AutoId from '../../utils/AutoId';
import { INSERT_NOTIFICATION } from '../notifications/actionTypes';
import { createThumbnail } from "react-native-create-thumbnail";
import saveImage from './save-image';
import RNFS from 'react-native-fs';
import { genExerciseVideoPath, genExerciseVideoThumbnailPath } from '../../utils/MediaPaths';

const saveVideos = (localUrl: string, videoId: string, localThumbnail: string) => async (dispatch: AppDispatch, getState: () => ReducerProps) => {
    //first compress
    const { user } = getState()
    let exercisesVideoBatch = getState().global.exercisesVideoBatch;

    let batch: ExercisesVideoBatchProps | undefined = exercisesVideoBatch.find(e => e.videoId === videoId);

    if (!batch) {
        batch = {
            videoId,
            localUrl,
            localThumbnail
        }
    }

    if (!batch) return;

    let removed: boolean | undefined | void;

    removed = await updateExerciseVideoBatch(batch, dispatch, getState).catch(err => console.log(err))
    if (removed) return;

    try {
        if (!batch.compressedUrl) {
            batch.compressedUrl = await compressVideo(localUrl)
        }
    } catch (err) {
        console.log(err);
    }

    if (!batch.compressedUrl) return notifyError(batch, dispatch, getState);
    //update state
    removed = await updateExerciseVideoBatch(batch, dispatch, getState).catch(err => console.log(err))
    if (removed) return;

    let uri = batch.url

    try {
        if (!uri) {
            batch.url = await saveVideoToStorage(genExerciseVideoPath(user.uid, videoId), batch.compressedUrl)
            //create thumbnail
            const thumbnailBase64 = await createThumbnail({ url: batch.localUrl })
                .then((response) => {
                    //get the base64 for firebase storage
                    return RNFS.readFile(response.path, 'base64')
                })
            if (thumbnailBase64) {
                //save thumbnail
                batch.thumbnail = await saveImage(thumbnailBase64, genExerciseVideoThumbnailPath(user.uid, videoId))()
            }
        }
    } catch (err: any) {
        console.log(err)
        return notifyError(batch, dispatch, getState)
    }


    removed = await updateExerciseVideoBatch(batch, dispatch, getState).catch(err => console.log(err))
    if (removed) return;

    const { data } = await request("POST", PATHS.video.upload, ({ payload }) => console.log(payload.msg) as any, { videoId: videoId, url: batch.url, thumbnail: batch.thumbnail });

    if (!data) return notifyError(batch, dispatch, getState);

    updateExerciseVideoBatch(batch, dispatch, getState, true)
}

const notifyError = async (batch: ExercisesVideoBatchProps, dispatch: AppDispatch, getState: () => ReducerProps) => {
    const { exercises, global } = getState()


    //find the exercise
    const targetExercise = exercises.data.find(e => e.videoId === batch.videoId)

    if (targetExercise) {
        let notifyErr: NotificationProps = {
            _id: AutoId.newId(20),
            date: new Date().toISOString(),
            createdAt: new Date().toISOString(),
            body: `Failed to upload video for exercise '${targetExercise.name}'`,
            notificationType: NotificationTypes.VIDEO_UPLOAD_ERROR,
            data: {
                exerciseProps: targetExercise
            }
        }
        dispatch({ type: INSERT_NOTIFICATION, payload: notifyErr })
    }

    //remove the item from the batch
    updateExerciseVideoBatch(batch, dispatch, getState, true)
}

const updateExerciseVideoBatch = async (batch: ExercisesVideoBatchProps, dispatch: AppDispatch, getState: () => ReducerProps, remove?: boolean) => {
    //get most recent
    const { exercisesVideoBatch } = getState().global;

    const batchIndex = exercisesVideoBatch.findIndex(item => item.videoId === batch.videoId);

    let newBatchStore;

    let removeItem = remove

    if (batchIndex > -1) {
        const batchItem = exercisesVideoBatch[batchIndex];
        if (batchItem.remove) {
            removeItem = true
        }
    }

    if (removeItem) {
        const findIndex = exercisesVideoBatch.findIndex(item => item.videoId == batch.videoId);
        if (findIndex > -1) exercisesVideoBatch.splice(findIndex, 1);
        newBatchStore = [...exercisesVideoBatch];
    } else {
        newBatchStore = _.uniqBy([batch, ...exercisesVideoBatch], 'videoId');
    }

    dispatch({ type: SET_EXERCISE_VIDEO_BATCH, payload: newBatchStore })
    AsyncStorage.setItem(LocalStoragePaths.exercisesVideosBatch, JSON.stringify(newBatchStore)).catch(err => console.log(err))

    return removeItem
}

const saveVideoToStorage = async (path: string, compressedUri: string) => {
    //create full path
    const storageRef = storage().ref(path);
    await storageRef.putFile(compressedUri)
    return storageRef.getDownloadURL()
}

const compressVideo = async (uri: string) => {
    // const compressedVideo = await ProcessingManager.trim(uri, {
    //     quality: VideoPlayer.Constants.quality.QUALITY_MEDIUM
    // })
    //     .then((data: string) => {
    //         return ProcessingManager.compress(data, {
    //             width: Constants.videoDim.width,
    //             height: Constants.videoDim.height,
    //             bitrateMultiplier: 3,
    //             minimumBitrate: 300000,
    //         })
    //     })
    const compressedVideo = await ProcessingManager.compress(uri, {
        bitrateMultiplier: 5,
        minimumBitrate: 500000,
    })
    return compressedVideo as string;
}

export default saveVideos;