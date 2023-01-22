import AsyncStorage from "@react-native-async-storage/async-storage";
import { ReducerProps } from "..";
import { AppDispatch } from "../../../App";
import LocalStoragePaths from "../../utils/LocalStoragePaths";
import { genWoImagePath } from "../../utils/MediaPaths";
import { SET_WO_IMAGE_BATCH } from "../global/actionTypes";
import { WoImageBatchProps } from "../global/types";
import { INSERT_NOTIFICATION } from "../notifications/actionTypes";
import { NotificationProps, NotificationTypes } from "../notifications/types";
import saveImage from "./save-image";
import _ from 'lodash';
import AutoId from "../../utils/AutoId";
import request from "./request";
import PATHS from "../../utils/PATHS";


//need to await the initial store

export default (base64: string, imageId: string) => async (dispatch: AppDispatch, getState: () => ReducerProps) => {
    const { user } = getState()
    let imageBatch = getState().global.woImageBatch;

    let batch: WoImageBatchProps | undefined = imageBatch.find(i => i.imageId === imageId)

    if (!batch) {
        batch = {
            base64,
            imageId
        }
    }

    if (!batch) return;

    await updateImageBatch(batch, dispatch, getState);

    const imagePath = genWoImagePath(user.uid, batch.imageId);

    try {
        if (!batch.url) {
            batch.url = await saveImage(batch.base64, imagePath)(dispatch)
        }
    } catch (err: any) {
        console.log(err)
        return notifyError(batch, dispatch, getState)
    }

    await updateImageBatch(batch, dispatch, getState);

    const { data } = await request("POST", PATHS.image.upload, ({ payload }) => console.log(payload.msg) as any, { imageId: batch.imageId, url: batch.url });

    if (!data) return notifyError(batch, dispatch, getState);

    updateImageBatch(batch, dispatch, getState, true)
}

const notifyError = async (batch: WoImageBatchProps, dispatch: AppDispatch, getState: () => ReducerProps) => {
    const { workout, global } = getState()

    //find the exercise
    const wo = workout.workouts.find(w => w.imageId === batch.imageId)

    if (wo) {
        let notifyErr: NotificationProps = {
            _id: AutoId.newId(20),
            date: new Date().toISOString(),
            createdAt: new Date().toISOString(),
            body: `Failed to upload image for '${wo.name}'`,
            notificationType: NotificationTypes.IMAGE_UPLOAD_ERROR,
            data: {
                exerciseProps: wo
            }
        }
        dispatch({ type: INSERT_NOTIFICATION, payload: notifyErr })
    }

    updateImageBatch(batch, dispatch, getState, true)
}

const updateImageBatch = async (batch: WoImageBatchProps, dispatch: AppDispatch, getState: () => ReducerProps, remove?: boolean) => {
    //get most recent
    const { woImageBatch } = getState().global;
    let newBatchStore;

    if (remove) {
        const findIndex = woImageBatch.findIndex(item => item.imageId == batch.imageId);
        if (findIndex > -1) woImageBatch.splice(findIndex, 1);
        newBatchStore = [...woImageBatch]
    } else {
        newBatchStore = _.uniqBy([batch, ...woImageBatch], 'imageId');
    }

    dispatch({ type: SET_WO_IMAGE_BATCH, payload: newBatchStore });
    AsyncStorage.setItem(LocalStoragePaths.woImageBatch, JSON.stringify(newBatchStore)).catch(err => console.log(err));
}
