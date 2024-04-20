import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  ActiveWorkoutProps,
  ExerciseOrderPayload,
  MoveExercisePayload,
} from './types';
import { WorkoutProps } from '@app/types';
import axios from 'axios';
import { PATHS, getURL } from '@app/utils';
import { ReducerProps } from '..';
import { setBanner } from '../banner/actions';
import { BannerTypes } from '../banner/types';
import { AppDispatch } from 'App';

const initialState: ActiveWorkoutProps = {
  workout: undefined,
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
  async (payload: ExerciseOrderPayload, { dispatch, getState }) => {
    axios
      .put(getURL(PATHS.workouts.updateExerciseOrder), payload)
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
    const rootState = getState() as ReducerProps;
    const workoutUid = rootState.activeWorkout.workout?._id as string;
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

const activeWorkout = createSlice({
  name: 'active-workout',
  initialState,
  reducers: {
    setActiveWorkout: (
      state: ActiveWorkoutProps,
      action: PayloadAction<WorkoutProps>,
    ) => {
      state.workout = action.payload;
    },
    clearActiveWorkout: (state: ActiveWorkoutProps) => {
      state.workout = undefined;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(removeExerciseAsync.fulfilled, (state, action) => {
        const exerciseId = action.payload;
        if (exerciseId && state.workout) {
          const exerciseIndex = state.workout.exercises.findIndex(
            exercise => exercise._id === exerciseId,
          );
          if (exerciseIndex > -1) {
            state.workout?.exercises.splice(exerciseIndex, 1);
          }
        }
      })
      .addCase(reorderExercisesAsync.fulfilled, (state, action) => {
        if (!state.workout) return;
        const updatedExercises = action.payload.exercises;
        state.workout.exercises.forEach(exercise => {
          const updatedProps = updatedExercises[exercise._id as string];
          if (updatedProps) {
            exercise.group = updatedProps.group;
            exercise.order = updatedProps.order;
          }
        });
      })
      .addCase(moveExerciseAsync.fulfilled, (state, action) => {
        if (!state.workout) return;

        const { exerciseId, groupIndex } = action.payload;

        const exerciseIndex = state.workout.exercises.findIndex(
          exercise => exercise._id === exerciseId,
        );

        if (exerciseIndex < 0) return;
        // Directly update the group property of the exercise
        state.workout.exercises[exerciseIndex].group = groupIndex;
      });
  },
});

export const { setActiveWorkout, clearActiveWorkout } = activeWorkout.actions;

export default activeWorkout.reducer;
