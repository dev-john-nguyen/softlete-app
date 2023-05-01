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

export const addExerciseGoalAsync = createAsyncThunk(
  'goals/addExerciseGoalAsync',
  async (goal: GoalInitProps, { dispatch }) => {
    const { data: newGoal }: { data?: GoalRespProps } = await request(
      'POST',
      PATHS.goals.upsert_exercise,
      dispatch,
      goal,
    );
    if (!newGoal) {
      throw new Error('Failed to add goal');
    }
    return newGoal;
  },
);

export const removeExerciseGoalAsync = createAsyncThunk(
  'goals/removeExerciseGoalAsync',
  async (exerciseGoalUid: string, { dispatch }) => {
    await request(
      'DELETE',
      PATHS.goals.delete_exercise(exerciseGoalUid),
      dispatch,
    );
    return exerciseGoalUid;
  },
);

// export const updateGoalAsync = createAsyncThunk(
//   'goals/updateGoalAsync',
//   async (updatedGoal: Goal) => {
//     const response = await fetch(`/api/goals/${updatedGoal._id}`, {
//       method: 'PUT',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(updatedGoal),
//     });
//     const data = await response.json();
//     return data;
//   },
// );

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
      .addCase(addExerciseGoalAsync.fulfilled, (state, action) => {
        const formatted = formatHandlerOfGoalResp(action.payload);
        state.user.exercises.push(formatted as ExerciseGoalProps);
      })
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
