import { Vibration } from 'react-native';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TimerProps, defaultTime } from './types';
import { notifyHandler, secondsToTime } from './helpers';
import { setBanner } from '@app/services';
import { BannerTypes } from '../banner/types';
import { ReducerProps } from '..';

const initialState: TimerProps = {
  time: defaultTime,
  initialTime: defaultTime,
};

const ONE_SECOND_IN_MS = 1000;

export const startTimerHandler = createAsyncThunk(
  'timer/startTimerHandler',
  async (_, { dispatch, getState }) => {
    const { timer: timerState } = getState() as ReducerProps;
    if (timerState.isRunning) {
      dispatch(pauseTime());
      return;
    }
    dispatch(setRunning(true));
    const timerRef = setInterval(async () => {
      const {
        timer: { time: prevTime },
      } = getState() as ReducerProps;
      const hrSecs = prevTime.hrs * 60 * 60;
      const minSecs = prevTime.mins * 60;
      let prevTimeInSecs = hrSecs + minSecs + prevTime.secs;
      if (prevTimeInSecs <= 0) {
        Vibration.vibrate([
          500,
          250, // Vibrate for 500ms, pause for 250ms
          500,
        ]);

        if (!(await notifyHandler())) {
          dispatch(
            setBanner(
              BannerTypes.default,
              'Workout timer has finished!',
              5 * ONE_SECOND_IN_MS,
            ),
          );
        }
        dispatch(clearTime());
      } else {
        prevTimeInSecs--;
        dispatch(updateTime(secondsToTime(prevTimeInSecs)));
      }
    }, 1000); // Timer interval in milliseconds (1 second)
    dispatch(setTimerId(timerRef));
  },
);

const timerSlice = createSlice({
  name: 'timer',
  initialState,
  reducers: {
    setTimerId: (state, action) => {
      // clear before setting another timeId instance
      if (state.timerId) {
        clearInterval(state.timerId);
      }
      state.timerId = action.payload;
    },
    setRunning: (state, action) => {
      state.isRunning = action.payload;
    },
    pauseTime: state => {
      state.isRunning = false;
      if (state.timerId) {
        clearInterval(state.timerId);
      }
    },
    updateTime: (state: TimerProps, action) => {
      state.time = action.payload;
    },
    setTime: (state: TimerProps, action) => {
      state.time = action.payload;
      state.initialTime = action.payload;
    },
    clearTime: (state: TimerProps) => {
      state.time = state.initialTime;
      state.timerId && clearInterval(state.timerId);
      state.isRunning = false;
    },
  },
});

export const {
  setTime,
  clearTime,
  pauseTime,
  setTimerId,
  setRunning,
  updateTime,
} = timerSlice.actions;

export default timerSlice.reducer;
