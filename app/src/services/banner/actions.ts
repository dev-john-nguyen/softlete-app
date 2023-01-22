import { REMOVE_BANNER, SET_BANNER } from './actionTypes';
import { BannerTypes } from './types';

export const setBanner = (
  type: BannerTypes,
  msg: string,
  duration?: number,
) => ({
  type: SET_BANNER,
  payload: {
    msg,
    type,
    duration,
  },
});

export const removeBanner = (id: string) => ({
  type: REMOVE_BANNER,
  payload: id,
});
