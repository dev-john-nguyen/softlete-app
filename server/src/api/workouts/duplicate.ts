const router = require('express').Router();
import Workout, {
  WorkoutProps,
  WorkoutStatus,
} from '../../collections/workouts';
import WorkoutExercises, {
  WorkoutExercisesProps,
} from '../../collections/workout-exercises';
import errorCatch from '../../utils/error-catch';
import { Types, Document } from 'mongoose';
import DateTools from '../../utils/DateTools';
import WorkoutHealthData, {
  WorkoutHealthDataProps,
} from '../../collections/workout-health-data';

router.post('/', async (req: any, res: any, next: any) => {
  //user has a id token
  //verify token
  const { uid } = req.headers;

  if (!uid) return res.status(401).send('cannot find user id.');

  if (!req.body) return res.status(400).send('Invalid request');

  const { workoutUid, date } = req.body as {
    workoutUid: Types.ObjectId;
    date: string;
  };

  if (!date || !DateTools.isValidDateStr(date))
    return res.status(400).send('Invalid date requests');

  if (!Types.ObjectId.isValid(workoutUid))
    return res.status(400).send('Invalid workout id.');

  let duplicateWorkout: WorkoutProps & Document<any, any, WorkoutProps>;
  let exercises = [];

  let workout: any;

  try {
    workout = await Workout.findById(workoutUid).select({
      _id: 0,
      createdAt: 0,
      updatedAt: 0,
      _v: 0,
      date: 0,
      accessCodes: 0,
      imageUri: 0,
      reflection: 0,
      strainRating: 0,
      likeUids: 0,
    });

    if (!workout) return res.status(404).send('Workout was not found.');

    exercises = await WorkoutExercises.find({ workoutUid: workoutUid }).select({
      _id: 0,
      createdAt: 0,
      updatedAt: 0,
      _v: 0,
    });

    duplicateWorkout = new Workout({
      ...workout.toObject(),
      status: WorkoutStatus.pending,
      date,
      userUid: uid,
    });

    await duplicateWorkout.save();
  } catch (err) {
    return errorCatch(err, res, next);
  }

  let savedExercises: (WorkoutExercisesProps &
    Document<any, any, WorkoutExercisesProps>)[] = [];

  if (exercises.length > 0) {
    //insert programWorkoutUid
    const clonedExercises = exercises.map(e => ({
      ...(e.toObject() as Object),
      date,
      workoutUid: duplicateWorkout._id,
      userUid: uid,
      data: e.data.map((d: any) => {
        //note that the data is a document type
        const { _id, performVal, ...restD } = d.toObject();
        return {
          ...restD,
        };
      }),
    }));

    try {
      savedExercises = await WorkoutExercises.insertMany(clonedExercises);
    } catch (err) {
      console.log(err);
      //remove deleted document
      duplicateWorkout.remove().catch(err => console.log(err));
      return res.status(500).send('Failed to copy workout. Please try again.');
    }
  }

  let dupHealthData: WorkoutHealthDataProps | undefined;
  //duplicate health data
  try {
    const workoutHealthData = await WorkoutHealthData.findOne({
      workoutUid: workoutUid,
      userUid: workout.userUid,
    }).select({ _id: 0 });

    if (workoutHealthData) {
      const newHealthData = new WorkoutHealthData({
        ...(workoutHealthData.toObject() as Object),
        workoutUid: duplicateWorkout._id,
        userUid: uid,
        date: duplicateWorkout.date,
      });

      await newHealthData.save();

      dupHealthData = newHealthData.toObject();
    }
  } catch (err) {
    console.log(err);
    duplicateWorkout.remove().catch(err => console.log(err));
    savedExercises.forEach(e => {
      e.remove().catch(err => console.log(err));
    });
    return res.status(500).send('Failed to copy workout. Please try again.');
  }

  const formatExercises = savedExercises.map(e => {
    const eObj = e.toObject();
    return {
      ...eObj,
      calcRef: e.calcRef ? parseFloat(e.calcRef.toString()) : 0,
      data: eObj.data.map(d => ({
        ...d,
        predictVal: d.predictVal ? parseFloat(d.predictVal.toString()) : 0,
        performVal: 0,
      })),
    };
  });

  res.send({
    ...duplicateWorkout.toObject(),
    exercises: formatExercises,
    healthData: dupHealthData ? dupHealthData : undefined,
  });
});

export default router;
