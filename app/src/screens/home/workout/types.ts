import { WorkoutExerciseProps } from '@app/types';

export type GroupParamsProps = {
  exercises: WorkoutExerciseProps[];
  totalExercises: number;
  groupIndex: number;
};
