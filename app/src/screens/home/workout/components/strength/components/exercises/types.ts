import { WorkoutExerciseProps } from 'src/types/workouts.types';

export type Positions = {
  [id: string]: PositionProps;
};

export type PositionProps = {
  positionY: number;
  height: number;
  sortOrder: number;
};

export type ItemLayoutProps = {
  height: number;
  pageX: number;
  pageY: number;
  translateY: number;
};

export type ExerciseDataProps = {
  key: string;
  label: string;
  id: string;
  exercises: WorkoutExerciseProps[];
  letterIndex: number;
};

export const CUSTOM_OFF_SET = 50;

export const GAP_BETWEEN_GROUPS = 20;
