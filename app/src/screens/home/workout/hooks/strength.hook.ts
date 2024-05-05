import { useMutation } from '@tanstack/react-query';
import { useWorkout } from '../contexts';
import { useMemo } from 'react';
import axios from 'axios';
import { PATHS, getURL } from '@app/utils';
import { groupWoExercisesByGroup } from '../helpers/workout.helpers';
import { useGetActiveWorkout } from './workout.hooks';
import { WorkoutProps } from '@app/types';
import { RouteProp, useRoute } from '@react-navigation/native';
import { HomeStackParamsList } from '../../types';

export const useExerciseGroupParams = () => {
  const { workout } = useWorkout();
  const groupParams = useMemo(() => {
    return groupWoExercisesByGroup(workout);
  }, [workout]);

  return {
    groupParams,
  };
};

export type ExerciseOrderPayload = {
  workoutUid: string;
  exercises: {
    [exerciseUid: string]: {
      group: number;
      order: number;
    };
  };
};

export const useUpdateExerciseOrder = () => {
  const mutation = useMutation(async (payload: ExerciseOrderPayload) => {
    return axios.put(getURL(PATHS.workouts.updateExerciseOrder), payload);
  });
  return mutation;
};

export const useActiveExercise = () => {
  const workout = useGetActiveWorkout() as WorkoutProps;
  const { params } =
    useRoute<RouteProp<HomeStackParamsList, 'WorkoutExercise'>>();

  return useMemo(() => {
    const { exerciseUid } = params;
    return workout.exercises.find(e => e._id === exerciseUid);
  }, [workout, params]);
};
