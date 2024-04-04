import { WorkoutProps } from '@app/types';
import { PATHS, getURL } from '@app/utils';
import { useRoute } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { ReducerProps } from 'src/services';

export const useFetchWorkout = () => {
  const user = useSelector((state: ReducerProps) => state.user);
  const route = useRoute<any>();
  const workoutUid = route.params.workoutUid;
  const { data, isFetching, isError } = useQuery<WorkoutProps>(
    ['fetch-workout', { workoutUid, uid: user.uid }],
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

  return {
    workout: data,
    isFetching,
    isError,
  };
};
