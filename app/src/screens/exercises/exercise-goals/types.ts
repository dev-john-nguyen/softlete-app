import { WorkoutExerciseProps, WorkoutProps } from 'src/services/workout/types';

export type GoalStatusProps = {
  status: string;
  color: string;
  icon: string;
};

export interface RespWorkoutExerciseProps
  extends Omit<WorkoutExerciseProps, 'workoutUid'> {
  workout: Omit<WorkoutProps, 'exercises' | 'healthData'>;
}
