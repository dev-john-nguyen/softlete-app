import { combineReducers } from 'redux';
import userReducer from './user/reducer';
import bannerReducer from './banner/reducer';
import exercisesReducer from './exercises/reducer';
import workoutReducer from './workout/reducer';
import globalReducer from './global/reducer';
import programReducer from './program/reducer';
import miscReducer from './misc/reducer';
import athletesReducer from './athletes/reducer';
import chatReducer from './chat/reducer';
import notificationReducer from './notifications/reducer';
import goalsReducer from './goals/slice';
import demoReducer from './demo/slice';
import timerReducer from './timer/slice';

import { GoalsRootStateProps } from './goals/types';
import { MiscProps } from './misc/types';
import { UserProps } from './user/types';
import { BannersProps } from './banner/types';
import { ExerciseBaseProps } from './exercises/types';
import { RootWorkoutProps } from '../types/workouts.types';
import { GlobalProps } from './global/types';
import { RootProgramProps } from './program/types';
import { AthletesRootProps } from './athletes/types';
import { ChatRootProps } from './chat/types';
import { NotificationRootProps } from './notifications/types';
import { ThunkDispatch } from 'redux-thunk';
import { DemoProps } from './services';
import { TimerProps } from './timer/types';

export default combineReducers({
  user: userReducer,
  banner: bannerReducer,
  exercises: exercisesReducer,
  workout: workoutReducer,
  global: globalReducer,
  program: programReducer,
  misc: miscReducer,
  athletes: athletesReducer,
  chat: chatReducer,
  notifications: notificationReducer,
  goals: goalsReducer,
  demo: demoReducer,
  timer: timerReducer,
});

export interface ReducerProps {
  user: UserProps;
  banner: BannersProps;
  exercises: ExerciseBaseProps;
  workout: RootWorkoutProps;
  global: GlobalProps;
  program: RootProgramProps;
  misc: MiscProps;
  athletes: AthletesRootProps;
  chat: ChatRootProps;
  notifications: NotificationRootProps;
  goals: GoalsRootStateProps;
  demo: DemoProps;
  timer: TimerProps;
}

export type ThunkAppDispatch = ThunkDispatch<ReducerProps, any, any>;
