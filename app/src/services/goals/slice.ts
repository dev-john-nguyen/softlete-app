import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import PATHS from 'src/utils/PATHS';
import { ReducerProps } from '..';
import request from '../utils/request';

interface Goal {
  _id?: number;
  startDate: Date;
  endDate: Date;
  target: number;
  description: string;
  name: string;
  exerciseId: string;
}

interface GoalsState {
  goals: Goal[];
}

const initialState: GoalsState = {
  goals: [],
};

export const addGoalAsync = createAsyncThunk(
  'goals/addGoalAsync',
  async (goal: Goal, { dispatch }) => {
    const { data: newGoal } = await request(
      'POST',
      PATHS.goals.create,
      dispatch,
      goal,
    );
    return newGoal;
  },
);

export const removeGoalAsync = createAsyncThunk(
  'goals/removeGoalAsync',
  async (goalId: number) => {
    const response = await fetch(`/api/goals/${goalId}`, {
      method: 'DELETE',
    });
    const data = await response.json();
    return data;
  },
);

export const updateGoalAsync = createAsyncThunk(
  'goals/updateGoalAsync',
  async (updatedGoal: Goal) => {
    const response = await fetch(`/api/goals/${updatedGoal._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedGoal),
    });
    const data = await response.json();
    return data;
  },
);

export const fetchGoalsAsync = createAsyncThunk(
  'goals/fetchGoalsAsync',
  async (_, { getState, dispatch }) => {
    const { user } = getState() as ReducerProps;
    const { data: goals } = await request(
      'GET',
      PATHS.goals.get(user.uid),
      dispatch,
    );
    return goals;
  },
);

const goalsSlice = createSlice({
  name: 'goals',
  initialState,
  reducers: {
    addGoal: (state, action) => {
      state.goals.push(action.payload);
    },
    removeGoal: (state, action) => {
      state.goals = state.goals.filter(goal => goal._id !== action.payload);
    },
    updateGoal: (state, action) => {
      const index = state.goals.findIndex(
        goal => goal._id === action.payload.id,
      );
      if (index !== -1) {
        state.goals[index] = action.payload;
      }
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchGoalsAsync.fulfilled, (state, action) => {
        state.goals = action.payload;
      })
      .addCase(addGoalAsync.fulfilled, (state, action) => {
        state.goals.push(action.payload);
      })
      .addCase(removeGoalAsync.fulfilled, (state, action) => {
        state.goals = state.goals.filter(goal => goal._id !== action.payload);
      })
      .addCase(updateGoalAsync.fulfilled, (state, action) => {
        const index = state.goals.findIndex(
          goal => goal._id === action.payload.id,
        );
        if (index !== -1) {
          state.goals[index] = action.payload;
        }
      });
  },
});

export const { addGoal, removeGoal, updateGoal } = goalsSlice.actions;

export default goalsSlice.reducer;
