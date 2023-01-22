import AsyncStorage from '@react-native-async-storage/async-storage';
import storage from '@react-native-firebase/storage';
import { ReducerProps } from '..';
import { AppDispatch } from '../../../App';
import LocalStoragePaths from '../../utils/LocalStoragePaths';
import { genExerciseVideoPath, genExerciseVideoThumbnailPath } from '../../utils/MediaPaths';
import { SET_EXERCISE_VIDEO_BATCH } from '../global/actionTypes';

const removeVideo = (uid: string, videoId: string) => async (dispatch: AppDispatch, getState: () => ReducerProps) => {
    //check to see if the video is in the batch
    const { exercisesVideoBatch } = getState().global;
    const foundIndex = exercisesVideoBatch.findIndex(item => item.videoId === videoId);
    if (foundIndex < 0) {
        //it is not in the batch
        //possible attempt to remove from firebase storage
        storage().ref(genExerciseVideoThumbnailPath(uid, videoId)).delete()
            .catch(err => console.log(err))
        storage().ref(genExerciseVideoPath(uid, videoId)).delete()
            .catch(err => console.log(err))
        return;
    }

    //remove the item from exerciseVideoBatch
    exercisesVideoBatch[foundIndex].remove = true
    dispatch({ type: SET_EXERCISE_VIDEO_BATCH, payload: [...exercisesVideoBatch] })
    exercisesVideoBatch.splice(foundIndex, 1)
    AsyncStorage.setItem(LocalStoragePaths.exercisesVideosBatch, JSON.stringify(exercisesVideoBatch)).catch(err => console.log(err))
}

export default removeVideo;