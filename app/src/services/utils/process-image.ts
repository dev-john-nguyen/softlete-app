import AsyncStorage from '@react-native-async-storage/async-storage';
import { ReducerProps } from '..';
import { AppDispatch } from '../../../App';
import LocalStoragePaths from '../../utils/LocalStoragePaths';
import { genWoImagePath } from '../../utils/MediaPaths';
import { SET_WO_IMAGE_BATCH } from '../global/actionTypes';
import { WoImageBatchProps } from '../global/types';
import { INSERT_NOTIFICATION } from '../notifications/actionTypes';
import { NotificationProps, NotificationTypes } from '../notifications/types';
import saveImage from './save-image';
import cloneDeep from 'lodash/cloneDeep';
import uniqBy from 'lodash/uniqBy';
import AutoId from '../../utils/AutoId';
import request from './request';
import PATHS from '../../utils/PATHS';

export default (base64: string, imageId: string) =>
  async (dispatch: AppDispatch, getState: () => ReducerProps) => {
    const { user } = getState();
    const imageBatch = getState().global.woImageBatch;

    let batch: WoImageBatchProps | undefined = imageBatch.find(
      i => i.imageId === imageId,
    );

    if (!batch) {
      // im adding a batch every time
      batch = {
        base64,
        imageId,
      };
    }

    if (!batch) return;

    updateImageBatch(batch, dispatch, getState);

    const imagePath = genWoImagePath(user.uid, batch.imageId);

    try {
      if (!batch.url) {
        batch.url = await saveImage(batch.base64, imagePath)(dispatch);
      }
    } catch (err: any) {
      console.log(err);
      return errorHandler(batch, dispatch, getState);
    }

    updateImageBatch(batch, dispatch, getState);

    const dispatchHandler = (({ payload }: any) =>
      console.log(payload.msg)) as AppDispatch;

    const { data } = await request(
      'POST',
      PATHS.image.upload,
      dispatchHandler,
      { imageId: batch.imageId, url: batch.url },
    );

    if (!data) return errorHandler(batch, dispatch, getState);

    updateImageBatch(batch, dispatch, getState, true);
  };

const errorHandler = async (
  batch: WoImageBatchProps,
  dispatch: AppDispatch,
  getState: () => ReducerProps,
) => {
  const workout = getState().workout;

  //find the exercise
  const wo = workout.workouts.find(w => w.imageId === batch.imageId);

  if (wo) {
    const notifyErr: NotificationProps = {
      _id: AutoId.newId(20),
      date: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      body: `Failed to upload image for '${wo.name}'`,
      notificationType: NotificationTypes.IMAGE_UPLOAD_ERROR,
      data: {
        exerciseProps: wo,
      },
    };
    dispatch({ type: INSERT_NOTIFICATION, payload: notifyErr });
  }

  updateImageBatch(batch, dispatch, getState, true);
};

const updateImageBatch = (
  batchProp: WoImageBatchProps,
  dispatch: AppDispatch,
  getState: () => ReducerProps,
  remove?: boolean,
) => {
  // need to clone batch as well bc it's keeping the same instance
  const batch = cloneDeep(batchProp);
  const woImageBatch = getState().global.woImageBatch;
  let newBatchStore = cloneDeep(woImageBatch);

  if (remove) {
    newBatchStore = newBatchStore.filter(b => b.imageId !== batch.imageId);
  } else {
    newBatchStore = uniqBy([batch, ...newBatchStore], 'imageId');
  }

  dispatch({ type: SET_WO_IMAGE_BATCH, payload: newBatchStore });

  AsyncStorage.setItem(
    LocalStoragePaths.woImageBatch,
    JSON.stringify(newBatchStore),
  ).catch(err => console.log(err));
};
