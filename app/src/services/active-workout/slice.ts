import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import {
  ActiveWorkoutProps,
  ExerciseOrderPayload,
  MoveExercisePayload,
  NewExercisePayload,
  WorkoutExerciseDataMetrics,
} from './types';
import {
  removeExerciseAsync,
  reorderExercisesAsync,
  moveExerciseAsync,
  addExerciseToWorkoutAsync,
  setActiveWorkoutAsync,
} from './async-actions';
import { storeWorkoutLocalStorage } from './helpers';
import { WorkoutExerciseDataProps, WorkoutStatus } from '@app/types';
import { AutoId } from '@app/utils';

const initialState: ActiveWorkoutProps = {
  workout: undefined,
};

const activeWorkout = createSlice({
  name: 'active-workout',
  initialState,
  reducers: {
    clearActiveWorkout: (state: ActiveWorkoutProps) => {
      state.workout = undefined;
    },
    updateStatus: (
      state: ActiveWorkoutProps,
      { payload: status }: PayloadAction<WorkoutStatus>,
    ) => {
      if (state.workout) {
        state.workout.status = status;
        storeWorkoutLocalStorage(state.workout);
      }
    },
    removeExercise: (
      state: ActiveWorkoutProps,
      { payload: exerciseId }: PayloadAction<string>,
    ) => {
      if (exerciseId && state.workout) {
        const exerciseIndex = state.workout.exercises.findIndex(
          exercise => exercise._id === exerciseId,
        );
        if (exerciseIndex > -1) {
          state.workout?.exercises.splice(exerciseIndex, 1);
        }
        storeWorkoutLocalStorage(state.workout);
      }
    },
    reorderExercises: (
      state,
      { payload }: PayloadAction<Omit<ExerciseOrderPayload, 'workoutUid'>>,
    ) => {
      const { exercises: updatedExercises } = payload;
      if (!state.workout) return;
      state.workout.exercises.forEach(exercise => {
        const updatedProps = updatedExercises[exercise._id as string];
        if (updatedProps) {
          exercise.group = updatedProps.group;
          exercise.order = updatedProps.order;
        }
      });
      state.workout && storeWorkoutLocalStorage(state.workout);
    },
    moveExercise: (state, { payload }: PayloadAction<MoveExercisePayload>) => {
      if (!state.workout) return;

      const { exerciseId, groupIndex } = payload;

      const exerciseIndex = state.workout.exercises.findIndex(
        exercise => exercise._id === exerciseId,
      );

      if (exerciseIndex < 0) return;
      // Directly update the group property of the exercise
      state.workout.exercises[exerciseIndex].group = groupIndex;
      storeWorkoutLocalStorage(state.workout);
    },
    addExercise: (
      state,
      { payload }: PayloadAction<Omit<NewExercisePayload, 'workoutUid'>>,
    ) => {
      if (!state.workout) return;
      const { exercises } = payload;
      exercises.forEach(exercise => {
        state.workout?.exercises.push({
          _id: exercise._id,
          exerciseUid: exercise.exerciseUid,
          order: exercise.order,
          group: exercise.group,
          details: exercise.details,
          data: exercise.data,
        });
      });
      storeWorkoutLocalStorage(state.workout);
    },
    addExerciseMetric: (
      state,
      { payload }: PayloadAction<{ exerciseUid: string }>,
    ) => {
      if (!state.workout) return;
      const targetExercise = state.workout.exercises.find(
        exercise => exercise._id === payload.exerciseUid,
      );

      if (targetExercise) {
        targetExercise.data.push({
          _id: AutoId.newId(20),
          reps: 0,
          performVal: 0,
          pct: 0,
          predictVal: 0,
        });
      }

      storeWorkoutLocalStorage(state.workout);
    },
    updateExerciseMetric: (
      state,
      {
        payload,
      }: PayloadAction<{
        exerciseUid: string;
        metricUid: string;
        metric: WorkoutExerciseDataMetrics;
        value: number;
      }>,
    ) => {
      if (!state.workout) return;

      const targetExercise = state.workout.exercises.find(
        exercise => exercise._id === payload.exerciseUid,
      );

      if (targetExercise) {
        const targetMetrics = targetExercise.data.find(
          metric => metric._id === payload.metricUid,
        );

        if (targetMetrics) {
          targetMetrics[payload.metric as keyof WorkoutExerciseDataProps] =
            payload.value as never;
        }
      }

      storeWorkoutLocalStorage(state.workout);
    },
    onDeleteExerciseMetric: (
      state,
      {
        payload,
      }: PayloadAction<{
        exerciseUid: string;
        metricUid: string;
      }>,
    ) => {
      if (!state.workout) return;

      const targetExercise = state.workout.exercises.find(
        exercise => exercise._id === payload.exerciseUid,
      );

      if (targetExercise) {
        const targetMetricsIndex = targetExercise.data.findIndex(
          metric => metric._id === payload.metricUid,
        );
        if (targetMetricsIndex > -1) {
          targetExercise.data.splice(targetMetricsIndex, 1);
        }
      }

      storeWorkoutLocalStorage(state.workout);
    },
    updateExerciseMetricStatus: (
      state,
      { payload }: PayloadAction<{ exerciseUid: string; metricUid: string }>,
    ) => {
      if (!state.workout) return;

      const targetExercise = state.workout.exercises.find(
        exercise => exercise._id === payload.exerciseUid,
      );

      if (targetExercise) {
        const targetMetrics = targetExercise.data.find(
          metric => metric._id === payload.metricUid,
        );

        if (targetMetrics) {
          targetMetrics.completed = targetMetrics.completed ? false : true;
        }
      }
      storeWorkoutLocalStorage(state.workout);
    },
    updateExerciseMetricWarmUpStatus: (
      state,
      { payload }: PayloadAction<{ exerciseUid: string; metricUid: string }>,
    ) => {
      if (!state.workout) return;

      const targetExercise = state.workout.exercises.find(
        exercise => exercise._id === payload.exerciseUid,
      );

      if (targetExercise) {
        const targetMetrics = targetExercise.data.find(
          metric => metric._id === payload.metricUid,
        );

        if (targetMetrics) {
          targetMetrics.warmup = targetMetrics.warmup ? false : true;
        }
      }
      storeWorkoutLocalStorage(state.workout);
    },
  },
  extraReducers: builder => {
    builder
      .addCase(setActiveWorkoutAsync.fulfilled, (state, action) => {
        state.workout = action.payload;
      })
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
            exerciseUid: exercise.exerciseUid,
            order: exercise.order,
            group: exercise.group,
            details: exercise.details,
            data: exercise.data,
          });
        });
      });
  },
});

export const {
  clearActiveWorkout,
  removeExercise,
  moveExercise,
  addExercise,
  reorderExercises,
  addExerciseMetric,
  updateExerciseMetric,
  onDeleteExerciseMetric,
  updateExerciseMetricWarmUpStatus,
  updateExerciseMetricStatus,
  updateStatus,
} = activeWorkout.actions;

export default activeWorkout.reducer;
