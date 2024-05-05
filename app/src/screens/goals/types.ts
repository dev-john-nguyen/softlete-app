import {
  HealthDataProps,
  WorkoutExerciseProps,
  WorkoutProps,
} from 'src/types/workouts.types';

export type GoalStatusProps = {
  status: string;
  color: string;
  icon: string;
};

export interface RespWorkoutExerciseProps
  extends Omit<WorkoutExerciseProps, 'workoutUid'> {
  workout: Omit<WorkoutProps, 'exercises' | 'healthData'>;
}

export interface RespHealthDataProps
  extends Omit<HealthDataProps, 'workoutUid'> {
  workout: Omit<WorkoutProps, 'exercises' | 'healthData'>;
}
