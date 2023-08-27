import { DemoExerciseData } from '@app/utils';
export const demoExerciseHandler = (userUid: string) => {
  return DemoExerciseData.exercises.map(e => {
    return {
      ...e,
      userUid: userUid,
    };
  });
};
