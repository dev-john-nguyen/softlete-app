import { WorkoutExerciseProps } from 'src/services/workout/types';

export type ItemLayoutProps = {
  height: number;
  pageX: number;
  pageY: number;
  translateY: number;
};

export type ExerciseDataProps = {
  label: string;
  id: string;
  exercises: WorkoutExerciseProps[];
  letterIndex: number;
};

export const CUSTOM_OFF_SET = 50;

export const GAP_BETWEEN_GROUPS = 20;
