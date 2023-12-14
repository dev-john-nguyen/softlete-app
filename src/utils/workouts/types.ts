import mongoose from 'mongoose';
import { ImagesSchemaProps } from '../../collections/images';
import { WorkoutExercisesProps } from '../../collections/workout-exercises';
import { WorkoutHealthDataProps } from '../../collections/workout-health-data';
import { WorkoutProps } from '../../collections/workouts';

export type WorkoutsProps = mongoose.Document<unknown, any, WorkoutProps> &
  WorkoutProps &
  Required<{
    _id: mongoose.Types.ObjectId;
  }>;

export type ExercisesProps = WorkoutExercisesProps &
  mongoose.Document<any, any, WorkoutExercisesProps>;

export type HealthDataProps = mongoose.Document<
  any,
  any,
  WorkoutHealthDataProps
> &
  WorkoutHealthDataProps & {
    _id: mongoose.Types.ObjectId;
  };

export type ImageProps = ImagesSchemaProps &
  mongoose.Document<any, any, ImagesSchemaProps>;

export interface FormattedWorkoutProps extends WorkoutProps {
  exercises: ExercisesProps[];
  healthData?: HealthDataProps;
  imageUri?: string;
}
