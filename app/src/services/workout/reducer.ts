/* eslint-disable no-case-declarations */
import {
  INITIATE_WORKOUT_HEADER,
  REMOVE_EDIT_WORKOUT,
  UPDATE_WORKOUTS,
  SET_SELECTED_DATE_WORKOUTS,
  SET_SELECTED_DATE,
  REMOVE_WORKOUTS,
  SET_COPY_WORKOUT,
  SET_VIEW_WORKOUT,
  UPDATE_WORKOUT_INFO,
  SET_FILTER_BY_PROGRAM,
  UPDATE_WORKOUT_EXERCISES,
  INSERT_WORKOUT_FETCHED_MONTH,
  INSERT_MY_WORKOUT_LIKE,
  CLEAR_WORKOUTS,
  SET_HEALTH_DATA,
  INSERT_HEALTH_DATA,
} from './actionTypes';
import DateTools from '../../utils/DateTools';
import {
  findAndRemoveWorkout,
  findAndUpdateWorkouts,
  findAndUpdateSelectedDateWorkouts,
  findAndUpdateWorkoutData,
  findMonthWorkouts,
  filterByProgram,
  findAndUpdateWorkoutExercises,
  findAllAndUpdateExerciseProps,
  updateOfflineMonthWos,
  findAndInsertLikeWo,
} from './utils';
import { WorkoutProps } from './types';
import { SIGNOUT_USER } from '../user/actionTypes';
import { UPDATE_EXERCISE } from '../exercises/actionTypes';
import { ExerciseProps } from '../exercises/types';
import _ from 'lodash';

const INITIAL_STATE = {
  workoutHeader: {},
  workouts: [],
  selectedDate: DateTools.dateToStr(new Date()),
  selectedDateWorkouts: [],
  monthWorkouts: {},
  copiedWorkout: '',
  viewWorkout: undefined,
  filterByProgramUid: '',
  fetchedMonths: [],
  healthData: [],
};

type ActionProps = {
  type: any;
  payload: any;
};

export default (state: any = INITIAL_STATE, action: ActionProps) => {
  let updatedWorkouts;
  switch (action.type) {
    case INITIATE_WORKOUT_HEADER:
      return {
        ...state,
        workoutHeader: { ...action.payload },
      };
    case REMOVE_EDIT_WORKOUT:
      return {
        ...state,
        workoutHeader: {},
      };
    case UPDATE_EXERCISE:
      updatedWorkouts = findAllAndUpdateExerciseProps(
        state.workouts,
        action.payload.exercise as ExerciseProps,
      );
      const updatedViewWorkout = findAllAndUpdateExerciseProps(
        [state.viewWorkout],
        action.payload.exercise as ExerciseProps,
      );
      return {
        ...state,
        workouts: updatedWorkouts,
        selectedDateWorkouts: findAndUpdateSelectedDateWorkouts(
          state.selectedDate,
          updatedWorkouts,
          state.filterByProgramUid,
        ),
        monthWorkouts: findMonthWorkouts(
          state.selectedDate,
          updatedWorkouts,
          state.filterByProgramUid,
        ),
        viewWorkout:
          updatedViewWorkout && updatedViewWorkout[0]
            ? updatedViewWorkout[0]
            : state.viewWorkout,
      };
    case UPDATE_WORKOUT_EXERCISES:
      const updatedWorkout = findAndUpdateWorkoutExercises(
        state.workouts,
        action.payload._id,
        action.payload.exercises,
      );
      if (!updatedWorkout) return state;
      updatedWorkouts = findAndUpdateWorkouts(state.workouts, [
        updatedWorkout,
      ]) as WorkoutProps[];
      //async so doesn't wait
      updateOfflineMonthWos(updatedWorkouts);
      return {
        ...state,
        selectedDateWorkouts: findAndUpdateSelectedDateWorkouts(
          state.selectedDate,
          updatedWorkouts,
          state.filterByProgramUid,
        ),
        monthWorkouts: findMonthWorkouts(
          state.selectedDate,
          updatedWorkouts,
          state.filterByProgramUid,
        ),
        workouts: updatedWorkouts,
        viewWorkout: updatedWorkout,
      };
    case INSERT_WORKOUT_FETCHED_MONTH:
      return {
        ...state,
        fetchedMonths: _.uniq([...state.fetchedMonths, action.payload]),
      };
    case UPDATE_WORKOUTS:
      updatedWorkouts = findAndUpdateWorkouts(
        state.workouts,
        action.payload,
      ) as WorkoutProps[];
      updateOfflineMonthWos(updatedWorkouts);
      return {
        ...state,
        selectedDateWorkouts: findAndUpdateSelectedDateWorkouts(
          state.selectedDate,
          updatedWorkouts,
          state.filterByProgramUid,
        ),
        monthWorkouts: findMonthWorkouts(
          state.selectedDate,
          updatedWorkouts,
          state.filterByProgramUid,
        ),
        workouts: updatedWorkouts,
      };
    case SET_SELECTED_DATE:
      return {
        ...state,
        selectedDate: action.payload,
        selectedDateWorkouts: findAndUpdateSelectedDateWorkouts(
          action.payload,
          state.workouts,
          state.filterByProgramUid,
        ),
      };
    case SET_SELECTED_DATE_WORKOUTS:
      return {
        ...state,
        selectedDateWorkouts: findAndUpdateSelectedDateWorkouts(
          state.selectedDate,
          state.workouts,
          state.filterByProgramUid,
        ),
      };
    case REMOVE_WORKOUTS:
      updatedWorkouts = findAndRemoveWorkout(
        state.workouts,
        action.payload as string[],
      );
      updateOfflineMonthWos(updatedWorkouts);
      return {
        ...state,
        selectedDateWorkouts: findAndUpdateSelectedDateWorkouts(
          state.selectedDate,
          updatedWorkouts,
          state.filterByProgramUid,
        ),
        monthWorkouts: findMonthWorkouts(
          state.selectedDate,
          updatedWorkouts,
          state.filterByProgramUid,
        ),
        workouts: updatedWorkouts,
      };
    case SET_COPY_WORKOUT:
      return {
        ...state,
        copiedWorkout: action.payload,
      };
    case SET_VIEW_WORKOUT:
      return {
        ...state,
        viewWorkout: action.payload,
      };
    case UPDATE_WORKOUT_INFO:
      updatedWorkouts = findAndUpdateWorkoutData(
        state.workouts,
        action.payload.workoutUid,
        action.payload.updatedData,
      );
      updateOfflineMonthWos(updatedWorkouts);
      return {
        ...state,
        selectedDateWorkouts: findAndUpdateWorkoutData(
          state.selectedDateWorkouts,
          action.payload.workoutUid,
          action.payload.updatedData,
        ),
        monthWorkouts: findMonthWorkouts(
          state.selectedDate,
          updatedWorkouts,
          state.filterByProgramUid,
        ),
        workouts: updatedWorkouts,
        viewWorkout: {
          ...state.viewWorkout,
          ...action.payload.updatedData,
        },
      };
    case SET_FILTER_BY_PROGRAM:
      //payload as programUid or empty string
      const filteredWorkouts = filterByProgram(action.payload, state.workouts);
      return {
        ...state,
        monthWorkouts: findMonthWorkouts(
          state.selectedDate,
          filteredWorkouts,
          action.payload,
        ),
        selectedDateWorkouts: findAndUpdateSelectedDateWorkouts(
          state.selectedDate,
          filteredWorkouts,
          action.payload,
        ),
        filterByProgramUid: action.payload,
      };
    case INSERT_MY_WORKOUT_LIKE:
      updatedWorkouts = findAndInsertLikeWo(
        state.workouts,
        action.payload.workoutUid,
        action.payload.uid,
      );
      updateOfflineMonthWos(updatedWorkouts);
      return {
        ...state,
        workouts: updatedWorkouts,
      };
    case SET_HEALTH_DATA:
      return {
        ...state,
        healthData: action.payload,
      };
    case INSERT_HEALTH_DATA:
      return {
        ...state,
        healthData: _.uniqBy([action.payload, ...state.healthData], '_id'),
      };
    case CLEAR_WORKOUTS:
      return {
        ...INITIAL_STATE,
        selectedDate: state.selectedDate,
      };
    case SIGNOUT_USER:
      return INITIAL_STATE;
    default:
      return state;
  }
};
