import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TimerProps, initialTime } from './types';
import { notifyHandler, secondsToTime } from './helpers';
import { setBanner } from '@app/services';
import { BannerTypes } from '../banner/types';
import { ReducerProps } from '..';

const initialState: TimerProps = {
  time: initialTime,
};

export const startTimerHandler = createAsyncThunk(
  'timer/startTimerHandler',
  async (_, { dispatch, getState }) => {
    const { timer: timerState } = getState() as ReducerProps;
    if (timerState.isRunning) {
      dispatch(pauseTime());
      return;
    }
    dispatch(setRunning(true));
    const timerRef = setInterval(() => {
      const {
        timer: { time: prevTime },
      } = getState() as ReducerProps;
      const hrSecs = prevTime.hrs * 60 * 60;
      const minSecs = prevTime.mins * 60;
      let prevTimeInSecs = hrSecs + minSecs + prevTime.secs;
      if (prevTimeInSecs <= 0) {
        if (!notifyHandler()) {
          dispatch(
            setBanner(BannerTypes.default, 'Workout timer has finished!'),
          );
        }
        dispatch(clearTime());
      } else {
        prevTimeInSecs--;
        dispatch(setTime(secondsToTime(prevTimeInSecs)));
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
    setTime: (state: TimerProps, action) => {
      state.time = action.payload;
    },
    clearTime: (state: TimerProps) => {
      state.time = initialTime;
      state.timerId && clearInterval(state.timerId);
      state.isRunning = false;
    },
  },
});

export const { setTime, clearTime, pauseTime, setTimerId, setRunning } =
  timerSlice.actions;

export default timerSlice.reducer;
