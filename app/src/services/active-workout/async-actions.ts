import { WorkoutProps } from '@app/types';
import { getURL, PATHS } from '@app/utils';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { AppDispatch } from 'App';
import axios from 'axios';
import { ReducerProps } from '..';
import { setBanner } from '../banner/actions';
import { BannerTypes } from '../banner/types';
import {
  getWorkoutFromLocalStorage,
  storeWorkoutLocalStorage,
} from './helpers';
import {
  ExerciseOrderPayload,
  MoveExercisePayload,
  NewExercisePayload,
} from './types';

// NOTE: Most of these async thunk actions are unused for now to move to local storage as the primary action

const getWorkoutUid = (getState: () => unknown) => {
  return (getState() as ReducerProps).activeWorkout.workout?._id as string;
};

export const removeExerciseAsync = createAsyncThunk(
  'active-workout/remove-exercise',
  async (exerciseUid: string, { dispatch, getState }) => {
    axios
      .post(getURL(PATHS.workouts.removeExercise), {
        exerciseUid: exerciseUid,
      })
      .catch(error => {
        console.error(error);
        setBanner(
          BannerTypes.error,
          'Oops! Having trouble saving your actions.',
        )(dispatch as AppDispatch, getState as () => ReducerProps);
      });
    return exerciseUid;
  },
);

export const reorderExercisesAsync = createAsyncThunk(
  'active-workout/reorder-exercises',
  async (
    payload: Omit<ExerciseOrderPayload, 'workoutUid'>,
    { dispatch, getState },
  ) => {
    const workoutUid = getWorkoutUid(getState);
    const requestPayload: ExerciseOrderPayload = {
      workoutUid,
      exercises: payload.exercises,
    };
    axios
      .put(getURL(PATHS.workouts.updateExerciseOrder), requestPayload)
      .catch(error => {
        console.error(error);
        setBanner(
          BannerTypes.error,
          'Oops! Having trouble saving your actions.',
        )(dispatch as AppDispatch, getState as () => ReducerProps);
      });
    return payload;
  },
);

export const moveExerciseAsync = createAsyncThunk(
  'active-workout/move-exercise',
  async (payload: MoveExercisePayload, { getState, dispatch }) => {
    const workoutUid = getWorkoutUid(getState);
    const requestPayload: ExerciseOrderPayload = {
      workoutUid,
      exercises: {
        [payload.exerciseId]: {
          group: payload.groupIndex,
          order: payload.order,
        },
      },
    };
    axios
      .put(getURL(PATHS.workouts.updateExerciseOrder), requestPayload)
      .catch(error => {
        console.error(error);
        setBanner(
          BannerTypes.error,
          'Oops! Having trouble saving your actions.',
        )(dispatch as AppDispatch, getState as () => ReducerProps);
      });
    return payload;
  },
);

export const addExerciseToWorkoutAsync = createAsyncThunk(
  'active-workout/add-exercises',
  async (
    payload: Omit<NewExercisePayload, 'workoutUid'>,
    { getState, dispatch },
  ) => {
    const workoutUid = getWorkoutUid(getState);
    const requestPayload: NewExercisePayload = {
      workoutUid,
      exercises: payload.exercises,
    };
    await axios
      .put(getURL(PATHS.workouts.insertExercises), requestPayload)
      .catch(error => {
        console.error(error);
        setBanner(
          BannerTypes.error,
          'Oops! Having trouble saving your actions.',
        )(dispatch as AppDispatch, getState as () => ReducerProps);
      });
    return payload;
  },
);

export const setActiveWorkoutAsync = createAsyncThunk(
  'active-workout/set-workout',
  async (workoutUid: string, { getState }) => {
    const { user } = getState() as ReducerProps;

    const workout = (await getWorkoutFromLocalStorage(
      workoutUid,
    )) as WorkoutProps;

    if (workout) return workout;

    const respWorkout = await axios
      .get(getURL(PATHS.workouts.fetchOne(user.uid, workoutUid)))
      .then(resp => resp.data as WorkoutProps | undefined);
    if (respWorkout) storeWorkoutLocalStorage(respWorkout);
    return respWorkout;
  },
);
