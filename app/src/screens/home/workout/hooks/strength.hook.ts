import { useWorkoutState } from '../contexts';
import _ from 'lodash';
import { useMemo } from 'react';
import { WorkoutExerciseProps } from 'src/services/workout/types';

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
