import mongoose from 'mongoose';
import WorkoutExercises from '../../collections/workout-exercises';
import WorkoutHealthData from '../../collections/workout-health-data';
import Image, { ImagesSchemaProps } from '../../collections/images';
import {
  ExercisesProps,
  FormattedWorkoutProps,
  HealthDataProps,
  ImageProps,
  WorkoutsProps,
} from './types';

export async function formatWorkoutsHandler(
  workouts: WorkoutsProps[],
  userUid: string,
) {
  if (workouts.length < 1) return [];
  // for each workout get the workoutUid to fetch all the exercises
  let workoutUids: mongoose.Types.ObjectId[] = [];
  workouts.forEach(w => {
    workoutUids.push(w._id);
  });
  if (workoutUids.length < 1) return [];

  // fetch the workout exercises
  const workoutsExercises = await WorkoutExercises.find({
    userUid,
    workoutUid: { $in: workoutUids as mongoose.Types.ObjectId[] },
  });

  // fetch the workout health data
  const workoutHealthData = await WorkoutHealthData.find({
    userUid,
    workoutUid: { $in: workoutUids as mongoose.Types.ObjectId[] },
  });

  // fetch workout image if exists
  // get all imageIds
  const imageIds: string[] = workouts
    .filter(w => w.imageId)
    .map(w => w.imageId as string);

  let imageDocs: (ImagesSchemaProps &
    mongoose.Document<any, any, ImagesSchemaProps>)[] = [];

  if (imageIds.length > 0) {
    imageDocs = await Image.find({ userUid, imageId: { $in: imageIds } });
  }

  const formattedWorkouts: FormattedWorkoutProps[] = [];

  workouts.forEach(workout => {
    let exercises: ExercisesProps[] = [];
    let healthData: HealthDataProps | undefined;
    let imageDoc: ImageProps | undefined;

    if (workoutsExercises.length > 0) {
      exercises = workoutsExercises.filter(e =>
        e.workoutUid.equals(workout._id),
      );
    }

    if (workoutHealthData.length > 0) {
      healthData = workoutHealthData.find(d =>
        d.workoutUid.equals(workout._id),
      );
    }

    if (imageDocs.length > 0 && workout.imageId) {
      imageDoc = imageDocs.find(i => i.imageId === workout.imageId);
    }

    const mappedExs = exercises.map(e => {
      const eObj = e.toJSON();
      return {
        ...eObj,
        calcRef: e.calcRef ? parseFloat(e.calcRef.toString()) : 0,
      };
    }) as unknown as ExercisesProps[];

    const formattedWo = {
      ...workout.toObject(),
      exercises: mappedExs,
      healthData: healthData
        ? (healthData.toObject() as HealthDataProps)
        : undefined,
      imageUri: imageDoc ? imageDoc.url : undefined,
    };

    formattedWorkouts.push(formattedWo);
  });

  return formattedWorkouts;
}
