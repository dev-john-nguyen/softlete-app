import { DemoExerciseData } from '@app/utils';
import { ExerciseProps } from '../../types/exercises.types';

export const clearDemoExerciseHandler = (exercises: ExerciseProps[]) => {
  return exercises.filter(e => {
    return !DemoExerciseData.exercises.find(de => de._id === e._id);
  });
};

export const demoExerciseHandler = (userUid: string) => {
  return DemoExerciseData.exercises.map(e => {
    return {
      ...e,
      userUid: userUid,
    };
  });
};
