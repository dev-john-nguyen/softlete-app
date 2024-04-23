import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  ActiveWorkoutProps,
  ExerciseOrderPayload,
  MoveExercisePayload,
  NewExercisePayload,
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
    console.log('resquest');
    const resp = await axios
      .put(getURL(PATHS.workouts.insertExercises), requestPayload)
      .catch(error => {
        console.error(error);
        setBanner(
          BannerTypes.error,
          'Oops! Having trouble saving your actions.',
        )(dispatch as AppDispatch, getState as () => ReducerProps);
      });
    console.log(resp);
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
      })
      .addCase(addExerciseToWorkoutAsync.fulfilled, (state, action) => {
        if (!state.workout) return;
        const { exercises } = action.payload;
        exercises.forEach(exercise => {
          state.workout?.exercises.push({
            _id: exercise._id,
            order: exercise.order,
            group: exercise.group,
            details: exercise.details,
            data: exercise.data,
          });
        });
      });
  },
});

export const { setActiveWorkout, clearActiveWorkout } = activeWorkout.actions;

export default activeWorkout.reducer;
