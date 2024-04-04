import { useCallback, useEffect } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { AppDispatch } from '../../../App';
import { ChatActionProps } from '../../services/chat/types';
import { ExerciseActionProps } from '../../types/exercises.types';
import { MiscActionProps } from '../../services/misc/types';
import { NotificationActionProps } from '../../services/notifications/types';
import { ProgramActionProps } from '../../services/program/types';
import { UserActionProps, UserProps } from '../../services/user/types';
import { SET_SELECTED_DATE } from '../../services/workout/actionTypes';
import { WorkoutActionProps } from '../../types/workouts.types';
import DateTools from '../../utils/DateTools';
import { useDispatch } from 'react-redux';
import { fetchGoalsAsync } from 'src/services/goals/slice';

interface ActionProps {
  fetchWorkouts: WorkoutActionProps['fetchWorkouts'];
  fetchGeneratedPrograms: ProgramActionProps['fetchGeneratedPrograms'];
  getFriends: UserActionProps['getFriends'];
  getChats: ChatActionProps['getChats'];
  initSockets: () => void;
  fetchLocalStoreExercisesToState: ExerciseActionProps['fetchLocalStoreExercisesToState'];
  fetchNotifications: NotificationActionProps['fetchNotifications'];
  processBatches: () => Promise<void>;
  fetchAllUserExercises: ExerciseActionProps['fetchAllUserExercises'];
  getAllHealthData: () => Promise<void>;
  getGlobalVars: () => Promise<void>;
  fetchPinExerciseAnalytics: MiscActionProps['fetchPinExerciseAnalytics'];
}

export function useApiHooks(
  offline: boolean,
  user: UserProps,
  actions: ActionProps,
) {
  const dispatch = useDispatch<AppDispatch>();
  const onMonthChange = async () => {
    //fetch the month workotus
    const d = new Date();
    const m = d.getMonth() + 1;
    const amtOfDays = new Date(d.getFullYear(), m, 0).getDate(); //d.getMonth() is the next month
    const fromDate = new Date(d.getFullYear(), m - 1, 1);
    const toDate = new Date(d.getFullYear(), m - 1, amtOfDays);
    const fromDateStr = DateTools.dateToStr(fromDate);
    const toDateStr = DateTools.dateToStr(toDate);
    dispatch({ type: SET_SELECTED_DATE, payload: DateTools.dateToStr(d) });
    await actions.fetchWorkouts(fromDateStr, toDateStr);
  };

  const initReduxState = useCallback(async () => {
    const d = new Date();
    const today = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    //await for store exercises
    onMonthChange();
    await actions
      .fetchLocalStoreExercisesToState()
      .catch(err => console.log(err));
    //get all types of programs
    if (!offline) {
      actions.getGlobalVars().catch(err => console.log(err));
      actions.fetchAllUserExercises().catch(err => console.log(err));
      actions.processBatches().catch(err => console.log(err));
      actions.fetchGeneratedPrograms().catch(err => console.log(err));
      actions.getFriends().catch(err => console.log(err));
      actions.getAllHealthData().catch(err => console.log(err));
      // actions.initSockets(); -> disconnecting sockets
      actions.getChats();
      actions.fetchNotifications();
      const endD = DateTools.dateToStr(today);
      const startD = DateTools.dateToStr(
        new Date(today.getFullYear() - 1, today.getMonth(), today.getDate()),
      );
      actions
        .fetchPinExerciseAnalytics(startD, endD, user.pinExercises)
        .catch(err => console.log(err));
      dispatch(fetchGoalsAsync())
        .unwrap()
        .catch(err => console.log(err));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [offline]);

  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (nextAppState === 'active') {
        initReduxState();
      }
    };

    AppState.addEventListener('change', handleAppStateChange);

    return () => {
      AppState.removeEventListener('change', handleAppStateChange);
    };
  }, [initReduxState]);

  useEffect(() => {
    initReduxState();
  }, [initReduxState, offline]);
}
