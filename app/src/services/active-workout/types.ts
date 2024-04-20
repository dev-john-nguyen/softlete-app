import { WorkoutProps } from '@app/types';

export type ActiveWorkoutProps = {
  workout?: WorkoutProps;
};

export type MoveExercisePayload = {
  exerciseId: string;
  groupIndex: number;
  order: number;
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
