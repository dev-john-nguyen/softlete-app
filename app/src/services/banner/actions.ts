import { AppDispatch } from 'App';
import { REMOVE_BANNER, SET_BANNER } from './actionTypes';
import { BannerTypes } from './types';
import { ReducerProps } from '..';
import { defaultErrorMsg } from 'src/utils/Constants';

export const setBanner =
  (type: BannerTypes, msg: string, duration?: number) =>
  (dispatch: AppDispatch, getState: () => ReducerProps) => {
    const { banners } = getState().banner;

    if (msg.includes(defaultErrorMsg)) {
      const exists = banners.find((b: any) => b.msg.includes(defaultErrorMsg));

      if (exists) return;

      return dispatch({
        type: SET_BANNER,
        payload: {
          msg,
          type,
          duration: 6000,
        },
      });
    }

    return dispatch({
      type: SET_BANNER,
      payload: {
        msg,
        type,
        duration,
      },
    });
  };

export const removeBanner = (id: string) => ({
  type: REMOVE_BANNER,
  payload: id,
});
