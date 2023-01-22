import remove from 'lodash/remove';
import AutoId from 'src/utils/AutoId';
import { REMOVE_BANNER, SET_BANNER } from './actionTypes';
import { BannerProps } from './types';

const INITIAL_STATE = {
  banners: [],
  count: 0,
};

export default (state = INITIAL_STATE, action: any) => {
  switch (action.type) {
    case SET_BANNER:
      const newBanner = { ...action.payload, id: AutoId.newId() };
      return {
        ...state,
        banners: [...state.banners, newBanner],
      };
    case REMOVE_BANNER:
      // retrieve all the banners not associated with payload
      const newBannerState = remove(
        [...state.banners],
        (banner: BannerProps) => banner.id !== action.payload,
      );
      return {
        ...state,
        banners: newBannerState,
      };
    default:
      return state;
  }
};
