import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import PATHS from 'src/utils/PATHS';
import { ReducerProps } from '..';
import request from '../utils/request';
import { formatHandlerOfGoalResp, formatHandlerOfGoalsResp } from './helpers';
import {
  ExerciseGoalProps,
  GoalInitProps,
  GoalRespProps,
  GoalsRootStateProps,
} from './types';

const initialState: GoalsRootStateProps = {
  user: {
    exercises: [],
    endurances: [],
    healths: [],
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
      });
    // .addCase(removeGoalAsync.fulfilled, (state, action) => {
    //   state.goals = state.goals.filter(goal => goal._id !== action.payload);
    // })
    // .addCase(updateGoalAsync.fulfilled, (state, action) => {
    //   const index = state.goals.findIndex(
    //     goal => goal._id === action.payload.id,
    //   );
    //   if (index !== -1) {
    //     state.goals[index] = action.payload;
    //   }
    // });
  },
});

// export const { } = goalsSlice.actions;

export default goalsSlice.reducer;
