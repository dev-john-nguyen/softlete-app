import { WorkoutProps } from '@app/types';

export type ActiveWorkoutProps = {
  workout?: WorkoutProps;
};

export type MoveExercisePayload = {
  exerciseId: string;
  groupIndex: number;
};
