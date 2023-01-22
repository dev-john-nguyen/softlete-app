import {
  SET_PIN_ANALYTICS,
  UPDATE_ANALYTICS,
  SET_PIN_EXERCISES,
} from './actionTypes';
import { insertOrUpdateAnalytics, findPinAnalytics } from './utils';
import { SIGNOUT_USER } from '../user/actionTypes';
import { REMOVE_EXERCISE } from '../exercises/actionTypes';
import { PinExerciseProps } from './types';
import _, { cloneDeep } from 'lodash';

const INITIAL_STATE = {
  pinExercisesAnalytics: [],
  fetchedAnalytics: [],
  activeAnalytics: [],
  pinExercises: [],
};

export default (state: any = INITIAL_STATE, action: any) => {
  switch (action.type) {
    case SET_PIN_EXERCISES:
      return {
        ...state,
        pinExercises: [...action.payload],
      };
    case SET_PIN_ANALYTICS:
      return {
        ...state,
        pinExercisesAnalytics: [...action.payload],
      };
    case UPDATE_ANALYTICS:
      let fetchedAnalytics = insertOrUpdateAnalytics(
        cloneDeep(state.fetchedAnalytics),
        action.payload,
      );
      return {
        ...state,
        activeAnalytics: [...action.payload],
        fetchedAnalytics: fetchedAnalytics,
        pinExercisesAnalytics: findPinAnalytics(
          fetchedAnalytics,
          state.pinExercises,
        ),
      };
    case REMOVE_EXERCISE:
      return {
        ...state,
        pinExercises: _.remove(
          state.pinExercises,
          (e: PinExerciseProps) => e.exerciseUid !== action.payload._id,
        ),
      };
    case SIGNOUT_USER:
      return INITIAL_STATE;
    default:
      return state;
  }
};
