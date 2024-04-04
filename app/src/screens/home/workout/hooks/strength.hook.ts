import { useMutation } from '@tanstack/react-query';
import { useWorkoutState } from '../contexts';
import _ from 'lodash';
import { useMemo } from 'react';
import { WorkoutExerciseProps } from 'src/types/workouts.types';
import axios from 'axios';
import { PATHS, getURL } from '@app/utils';

export type GroupParamsProps = {
  exercises: WorkoutExerciseProps[];
  totalExercises: number;
};

export const useExerciseGroupParams = () => {
  const { workout } = useWorkoutState();
  const groupParams = useMemo(() => {
    const groupParamsByLetterIndex = new Map<number, GroupParamsProps>();
    if (!workout.exercises) {
      return groupParamsByLetterIndex;
    }
    workout.exercises.forEach((e, i) => {
      const groupInstance = groupParamsByLetterIndex.get(e.group);
      if (groupInstance) {
        groupInstance.exercises.push(e);
        groupInstance.totalExercises++;
      } else {
        groupParamsByLetterIndex.set(e.group, {
          exercises: [],
          totalExercises: 1,
        });
      }
    });
    return groupParamsByLetterIndex;
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
