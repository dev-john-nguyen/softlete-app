const router = require('express').Router();
import ProgramWorkouts from '../../../collections/program-template-workouts';
import ProgramExercises from '../../../collections/program-template-exercises';
import ProgramTemplateHealthData, {
  ProgramTemplateHealthDataProps,
} from '../../../collections/program-template-health-data';
import errorCatch from '../../../utils/error-catch';
import { ProgramTemplateWorkoutsProps } from '../../../collections/program-template-workouts';
import { ProgramTemplateExercisesProps } from '../../../collections/program-template-exercises';
import mongoose from 'mongoose';

router.post('/', async (req: any, res: any, next: any) => {
  //user has a id token
  //verify token
  const { uid } = req.headers;

  if (!uid) return res.status(401).send('cannot find user id.');

  if (!req.body) return res.status(400).send('Invalid request');

  const { workoutUid, daysFromStart } = req.body;

  if (!mongoose.Types.ObjectId.isValid(workoutUid))
    return res.status(401).send('Invalid workout id.');

  if (typeof daysFromStart !== 'number')
    return res.status(401).send('Invalid data.');

  let duplicateWorkout: ProgramTemplateWorkoutsProps &
    import('mongoose').Document<any, any, ProgramTemplateWorkoutsProps>;
  let workout: any;
  let exercises = [];

  try {
    //duplicate workoutUid with daysFromStart
    workout = await ProgramWorkouts.findById(workoutUid).select({
      name: 1,
      programTemplateUid: 1,
      description: 1,
      _id: 0,
      userUid: 1,
      type: 1,
    });

    if (!workout) return res.status(404).send('Workout was not found.');

    exercises = await ProgramExercises.find({
      programWorkoutUid: workoutUid,
    }).select({
      _id: 0,
      createdAt: 0,
      updatedAt: 0,
      _v: 0,
      programWorkoutUid: 0,
      userUid: 0,
    });

    duplicateWorkout = new ProgramWorkouts({
      ...workout.toObject(),
      daysFromStart,
      userUid: uid,
    });

    await duplicateWorkout.save();
  } catch (err) {
    return errorCatch(err, res, next);
  }

  let savedExercises: (ProgramTemplateExercisesProps &
    mongoose.Document<any, any, ProgramTemplateExercisesProps>)[] = [];

  if (exercises.length > 0) {
    //insert programWorkoutUid
    const clonedExercises = exercises.map(e => ({
      ...(e.toObject() as any),
      programWorkoutUid: duplicateWorkout._id,
      userUid: uid,
    }));

    try {
      savedExercises = await ProgramExercises.insertMany(clonedExercises);
    } catch (err) {
      //remove deleted document
      await duplicateWorkout.remove().catch(err => console.log(err));
      return res.status(500).send('Failed to copy workout. Please try again.');
    }
  }

  let dupHealthData: ProgramTemplateHealthDataProps | undefined;
  //duplicate health data
  try {
    const workoutHealthData = await ProgramTemplateHealthData.findOne({
      programWorkoutUid: workoutUid,
      userUid: workout.userUid,
    }).select({
      _id: 0,
      createdAt: 0,
      updatedAt: 0,
      _v: 0,
    });

    if (workoutHealthData) {
      const newHealthData = new ProgramTemplateHealthData({
        ...(workoutHealthData.toObject() as any),
        programWorkoutUid: duplicateWorkout._id,
        userUid: uid,
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
