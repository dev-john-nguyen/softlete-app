import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { ActiveWorkoutProps, MoveExercisePayload } from './types';
import { WorkoutProps } from '@app/types';
import axios from 'axios';
import { PATHS, getURL } from '@app/utils';

const initialState: ActiveWorkoutProps = {
  workout: undefined,
};

export const removeExerciseAsync = createAsyncThunk(
  'active-workout/remove-exercise',
  async (exerciseUid: string) => {
    await axios.post(getURL(PATHS.workouts.removeExercise), {
      exerciseUid: exerciseUid,
    });
    return exerciseUid;
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
    moveExercise: (
      state: ActiveWorkoutProps,
      action: PayloadAction<MoveExercisePayload>,
    ) => {
      if (!state.workout) return;

      const { exerciseId, groupIndex } = action.payload;

      const exerciseIndex = state.workout.exercises.findIndex(
        exercise => exercise._id === exerciseId,
      );

      if (exerciseIndex < 0) return;
      // Directly update the group property of the exercise
      state.workout.exercises[exerciseIndex].group = groupIndex;
    },
    clearActiveWorkout: (state: ActiveWorkoutProps) => {
      state.workout = undefined;
    },
  },
  extraReducers: builder => {
    builder.addCase(removeExerciseAsync.fulfilled, (state, action) => {
      const exerciseId = action.payload;
      if (exerciseId && state.workout) {
        const exerciseIndex = state.workout.exercises.findIndex(
          exercise => exercise._id === exerciseId,
        );
        if (exerciseIndex > -1) {
          state.workout?.exercises.splice(exerciseIndex, 1);
        }
        state.workout = state.workout;
      }
    });
  },
});

export const { setActiveWorkout, clearActiveWorkout, moveExercise } =
  activeWorkout.actions;

export default activeWorkout.reducer;
