import { setActiveWorkout } from '@app/services';
import { WorkoutProps } from '@app/types';
import { PATHS, getURL } from '@app/utils';
import { useRoute } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useEffect } from 'react';
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
  const { data, isFetching, isError } = useQuery<WorkoutProps>(
    ['fetch-workouts', { workoutUid, uid: user.uid }],
    async () => {
      return axios
        .get(getURL(PATHS.workouts.fetchOne(user.uid, route.params.workoutUid)))
        .then(resp => resp.data);
    },
    {
      enabled: Boolean(user.uid && workoutUid),
      cacheTime: 0,
    },
  );

  useEffect(() => {
    data && dispatch(setActiveWorkout(data));
  }, [data, dispatch]);

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
