import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import PATHS from 'src/utils/PATHS';
import { ReducerProps } from '..';
import request from '../utils/request';
import { formatHandlerOfGoalResp, formatHandlerOfGoalsResp } from './helpers';
import {
  ExerciseGoalProps,
  GoalInitProps,
  GoalProps,
  GoalRespProps,
  GoalTypes,
  GoalsRootStateProps,
} from './types';

const initialState: GoalsRootStateProps = {
  user: {
    exercises: [],
    endurances: [],
    healths: {
      activeCalories: undefined,
      sleep: undefined,
    },
  },
};

export const upsertExerciseGoalAsync = createAsyncThunk(
  'goals/upsertExerciseGoalAsync',
  async (goal: GoalInitProps, { dispatch }) => {
    const { data: respGoal }: { data?: GoalRespProps } = await request(
      'POST',
      PATHS.goals.upsert_exercise,
      dispatch,
      goal,
    );
    if (!respGoal) {
      throw new Error('Failed to add goal');
    }
    return { respGoal, updated: goal._id ? true : false };
  },
);

export const removeExerciseGoalAsync = createAsyncThunk(
  'goals/removeExerciseGoalAsync',
  async (goalId: string, { dispatch }) => {
    await request('DELETE', PATHS.goals.delete_exercise(goalId), dispatch);
    return goalId;
  },
);
export const fetchGoalsAsync = createAsyncThunk(
  'goals/fetchGoalsAsync',
  async (_, { getState, dispatch }) => {
    const { user } = getState() as ReducerProps;
    const { data: goals }: { data?: GoalRespProps[] } = await request(
      'GET',
      PATHS.goals.get(user.uid),
      dispatch,
    );
    if (!goals) {
      throw new Error('Failed to fetch goals');
    }
    return goals;
  },
);

export const updateHealthGoalsAsync = createAsyncThunk(
  'goals/updateHealthGoalsAsync',
  async (goal: { sleep: number; activeCalories: number }, { dispatch }) => {
    // this should return an array of two goals ( sleep & activeCalories )
    const { data }: { data?: GoalProps[] } = await request(
      'POST',
      PATHS.goals.upsert_health,
      dispatch,
      goal,
    );
    if (!data) throw new Error('Failted to update health goals');
    return data;
  },
);

const goalsSlice = createSlice({
  name: 'goals',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchGoalsAsync.fulfilled, (state, action) => {
        state.user = formatHandlerOfGoalsResp(action.payload);
      })
      .addCase(
        upsertExerciseGoalAsync.fulfilled,
        (state, { payload: { respGoal, updated } }) => {
          const formatted = formatHandlerOfGoalResp(
            respGoal,
          ) as ExerciseGoalProps;
          if (updated) {
            const index = state.user.exercises.findIndex(
              goal => goal._id === formatted._id,
            );
            if (index !== -1) {
              state.user.exercises[index] = formatted;
            }
          } else {
            state.user.exercises.push(formatted as ExerciseGoalProps);
          }
        },
      )
      .addCase(removeExerciseGoalAsync.fulfilled, (state, action) => {
        const index = state.user.exercises.findIndex(
          goal => goal._id === action.payload,
        );
        if (index !== -1) {
          state.user.exercises.splice(index, 1);
        }
      })
      .addCase(updateHealthGoalsAsync.fulfilled, (state, action) => {
        state.user.healths.sleep = action.payload.find(
          goal => goal.type === GoalTypes.sleep,
        );
        state.user.healths.activeCalories = action.payload.find(
          goal => goal.type === GoalTypes.active_calories,
        );
      });
  },
});

export default goalsSlice.reducer;
