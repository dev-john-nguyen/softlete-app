import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import PATHS from 'src/utils/PATHS';
import { ReducerProps } from '..';
import request from '../utils/request';
import { formatHandlerOfGoalResp } from './helpers';
import { ExerciseGoal, GoalStateProps, GoalsRootStateProps } from './types';

const initialState: GoalsRootStateProps = {
  user: {
    _id: '',
    sleep: 0,
    activeCalories: 0,
    exercises: [],
  },
};

export const addExerciseGoalAsync = createAsyncThunk(
  'goals/addExerciseGoalAsync',
  async (goal: ExerciseGoal, { dispatch }) => {
    const { data: newGoal }: { data?: GoalStateProps } = await request(
      'POST',
      PATHS.goals.update_exercise,
      dispatch,
      goal,
    );
    if (!newGoal) {
      throw new Error('Failed to add goal');
    }
    return newGoal;
  },
);

// export const removeGoalAsync = createAsyncThunk(
//   'goals/removeGoalAsync',
//   async (goalId: number) => {
//     const response = await fetch(`/api/goals/${goalId}`, {
//       method: 'DELETE',
//     });
//     const data = await response.json();
//     return data;
//   },
// );

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
    const { data: goals }: { data?: GoalStateProps } = await request(
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
        state.user = formatHandlerOfGoalResp(action.payload);
      })
      .addCase(addExerciseGoalAsync.fulfilled, (state, action) => {
        state.user = formatHandlerOfGoalResp(action.payload);
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
