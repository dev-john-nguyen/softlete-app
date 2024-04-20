import { createSlice } from '@reduxjs/toolkit';
import { DemoProps } from './types';

const initialState: DemoProps = {
  state: undefined,
};

const demoSlice = createSlice({
  name: 'demo',
  initialState,
  reducers: {
    setDemoState: (state: DemoProps, action) => {
      state.state = action.payload;
    },
    clear: (state: DemoProps) => {
      state.state = undefined;
    },
  },
});

export const { setDemoState, clear } = demoSlice.actions;

export default demoSlice.reducer;
