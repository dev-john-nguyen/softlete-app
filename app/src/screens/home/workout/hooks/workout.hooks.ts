import { setActiveWorkoutAsync } from '@app/services';
import { useFocusEffect, useRoute } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ReducerProps, ThunkAppDispatch } from 'src/services';

const getUser = (state: ReducerProps) => state.user;
const getActiveWorkout = (state: ReducerProps) => state.activeWorkout.workout;

export const useFetchWorkout = () => {
  const user = useSelector(getUser);
  const activeWorkout = useSelector(getActiveWorkout);
  const route = useRoute<any>();
  const dispatch = useDispatch<ThunkAppDispatch>();
  const workoutUid = route.params.workoutUid;
  const { isFetching, isError, refetch } = useQuery(
    ['fetch-workouts', { workoutUid, uid: user.uid }],
    async () => {
      return dispatch(setActiveWorkoutAsync(workoutUid)).unwrap();
    },
    {
      enabled: false,
      cacheTime: 0,
    },
  );

  useFocusEffect(
    useCallback(() => {
      if (Boolean(user.uid && workoutUid)) {
        refetch();
      }
    }, []),
  );

  return {
    workout: activeWorkout,
    isFetching,
    isError,
  };
};

export const useGetActiveWorkout = () => {
  const activeWorkout = useSelector(getActiveWorkout);
  return activeWorkout;
};
