import { useMutation } from '@tanstack/react-query';
import { useWorkout } from '../contexts';
import _ from 'lodash';
import { useMemo } from 'react';
import { WorkoutExerciseProps } from 'src/types/workouts.types';
import axios from 'axios';
import { PATHS, getURL } from '@app/utils';
import { groupWoExercisesByGroup } from '../helpers/workout.helpers';

export type GroupParamsProps = {
  exercises: WorkoutExerciseProps[];
  totalExercises: number;
};

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
