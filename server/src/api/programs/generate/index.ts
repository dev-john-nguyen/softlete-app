const router = require('express').Router();
import mongoose from 'mongoose';
import Programs from '../../../collections/programs';
import ProgramTemplates from '../../../collections/program-templates';
import ProgramTemplateWorkouts from '../../../collections/program-template-workouts';
import ProgramTemplateExercises from '../../../collections/program-template-exercises';
import programTemplateHealthData from '../../../collections/program-template-health-data';
import UserExerciseMeas from '../../../collections/user-exercise-measurements';
import Workouts, { WorkoutProps } from '../../../collections/workouts';
import WorkoutExercises, {
  WorkoutExercisesProps,
} from '../../../collections/workout-exercises';
import errorCatch from '../../../utils/error-catch';
import DateTools from '../../../utils/DateTools';
import _ from 'lodash';
import WorkoutHealthData, {
  WorkoutHealthDataProps,
} from '../../../collections/workout-health-data';
import { handleGenProgramNotification } from './utils';

//steps to generate the program
//get all workouts and exercises by using ProgramTemplateUid
//prepare the data
////will need to receive start date and use daysFromStart to generate dates
//ensure to attach programTemplateUid and generate a new programUid
//there can be multiple programTemplates generated
//prevent user from over generateing programTemplates
////can do this be checking dates (start and end date)
//health data

//note:
// this route is heavy. Not sure how to handle minimizing the process of generating a program

router.post('/', async (req: any, res: any, next: any) => {
  //user has a id token
  //verify token
  const { uid } = req.headers;

  if (!uid) return res.status(401).send('cannot find user id.');

  if (!req.body) return res.status(400).send('Invalid request');

  const { _id, startDate, accessCode } = req.body;

  if (!startDate || typeof startDate !== 'string')
    return res.status(401).send('Invalid date provided.');

  if (!mongoose.Types.ObjectId.isValid(_id))
    return res.status(401).send('Invalid program id.');

  const dObj = DateTools.strToDate(startDate as string);

  if (!dObj || Object.prototype.toString.call(dObj) !== '[object Date]')
    return res.status(401).send('Failed to convert date.');

  const startDateObj = DateTools.getStartOfNextWeek(dObj);

  //retrieve program data
  const program = await ProgramTemplates.findById(_id).select({
    createdAt: 0,
    updatedAt: 0,
    _v: 0,
  });

  if (!program)
    return res.status(404).send('Program not found. Please try again.');
  const programData = program.toObject();

  //identify if the user has authorization and the program is private
  if (uid !== programData.userUid && programData.isPrivate) {
    if (!accessCode) return res.status('401').send('Access code is required.');
    const validCode = programData.accessCodes.find(code => code === accessCode);
    if (!validCode) return res.status('401').send('Access code is invalid.');
  }

  //filter to remove the fields that are to be replaced when generating
  const filter = {
    createdAt: 0,
    updatedAt: 0,
    _v: 0,
    programTemplateUid: 0,
    userUid: 0,
  };

  //get all workouts
  const programWorkouts = await ProgramTemplateWorkouts.find({
    programTemplateUid: programData._id,
  }).select(filter);

  if (!programWorkouts || programWorkouts.length < 1)
    return res
      .status(401)
      .send(
        "Couldn't found any workouts associated with this program. Please try again",
      );

  //get all exercises associated with this program
  const programExercises = await ProgramTemplateExercises.find({
    programTemplateUid: programData._id,
  }).select({ ...filter, _id: 0 });

  //get all health data
  const programHealthData = await programTemplateHealthData
    .find({ programTemplateUid: programData._id })
    .select({ ...filter, _id: 0 });

  const {
    _id: programTemplateUid,
    userUid: programUserUid,
    ...rest
  } = programData;

  //generate a new program
  const newProgram = new Programs({
    programTemplateUid: programTemplateUid,
    userUid: uid,
    startDate,
    ...rest,
  });

  //save new program
  try {
    await newProgram.save();
  } catch (err) {
    return errorCatch(err, res, next);
  }

  //generate new workouts

  //new exercise store to insert to collection
  //new health data store to insert to collection
  let newExercises: WorkoutExercisesProps[] = [];
  let newHealthData: WorkoutHealthDataProps[] = [];

  const newWorkouts = programWorkouts.map(workout => {
    const {
      daysFromStart,
      _id: workoutUid,
      ...workoutRest
    } = workout.toObject();

    const newId = new mongoose.Types.ObjectId();

    //Populate the dates
    const workoutDate = DateTools.addDaysToDate(startDateObj, daysFromStart);
    const workoutDateStr = DateTools.dateToStr(workoutDate);

    const exercises: WorkoutExercisesProps[] = programExercises
      .filter(e => e.toObject().programWorkoutUid.equals(workoutUid))
      .map(e => {
        const { programWorkoutUid, ...eRest } = e.toObject();
        //I want to replace programWorkoutUid with workoutUid
        //only copy calcRef if the user is the owner
        const calcRef =
          uid === programData.userUid && e.calcRef ? e.calcRef : 0;
        return {
          ...eRest,
          workoutUid: newId,
          userUid: uid,
          programUid: newProgram._id,
          date: workoutDateStr,
          calcRef: calcRef,
          data: eRest.data.map(d => ({
            ...d,
            performVal: 0 as unknown as mongoose.Types.Decimal128,
          })),
        };
      });

    //push to store to insert into collection
    newExercises.push(...exercises);

    const healthData = programHealthData.find(data =>
      data.programWorkoutUid.equals(workoutUid),
    );

    if (healthData) {
      const { programWorkoutUid, ...healthRest } = healthData.toObject();
      //push to store to insert into collection
      newHealthData.push({
        ...healthRest,
        workoutUid: newId,
        userUid: uid,
        date: workoutDateStr,
      });
    }

    return {
      ...workoutRest,
      _id: newId,
      date: workoutDateStr,
      programUid: newProgram._id,
      userUid: uid,
    };
  });

  if (newWorkouts.length < 1) {
    await newProgram.delete().catch((err: any) => console.log(err));
    return res
      .status(401)
      .send('Need to have at least one workout in the program.');
  }

  let insertedWos: (WorkoutProps &
    mongoose.Document<any, any, WorkoutProps>)[] = [];

  try {
    insertedWos = await Workouts.insertMany(newWorkouts);
  } catch (err) {
    console.log(err);
  }

  if (insertedWos.length < 1) {
    await newProgram.delete().catch((err: any) => console.log(err));
    return res.status(500).send('Failed to insert workouts. Please try again.');
  }

  let insertedExs: (WorkoutExercisesProps &
    mongoose.Document<any, any, WorkoutExercisesProps>)[] = [];

  try {
    if (newExercises.length > 0) {
      insertedExs = await WorkoutExercises.insertMany(newExercises);
    }
  } catch (err) {
    console.log(err);
    await newProgram.delete().catch((err: any) => console.log(err));
    //remove inserted workouts
    insertedWos.forEach(e => {
      e.delete().catch((err: any) => console.log(err));
    });
    return res
      .status(500)
      .send('An error occurred when trying to inset exercises.');
  }

  //insert health data
  let insertedHealthData: (WorkoutHealthDataProps &
    mongoose.Document<any, any, WorkoutHealthDataProps>)[] = [];

  try {
    if (newHealthData.length > 0) {
      insertedHealthData = await WorkoutHealthData.insertMany(newHealthData);
    }
  } catch (err) {
    console.log(err);
    await newProgram.delete().catch((err: any) => console.log(err));
    //remove inserted workouts
    insertedWos.forEach(e => {
      e.delete().catch((err: any) => console.log(err));
    });
    insertedExs.forEach(e => {
      e.delete().catch((err: any) => console.log(err));
    });
    return res
      .status(500)
      .send('An error occurred when trying to insert health data.');
  }

  /////////////////if not the owner duplicate meas
  if (programUserUid !== uid) {
    //everything created now update/insert meas data
    let exUids: mongoose.Types.ObjectId[] = [];

    programExercises.forEach(e => {
      exUids.push(e.exerciseUid);
    });

    if (exUids.length > 0) {
      //the owner of the program
      try {
        const filterMeas = {
          userUid: 0,
          _id: 0,
          _v: 0,
          createdAt: 0,
          updatedAt: 0,
        };

        const programUserMeasDocs = await UserExerciseMeas.find({
          exerciseUid: { $in: exUids },
          userUid: programUserUid,
        }).select(filterMeas);

        //user copying
        const userMeasDocs = await UserExerciseMeas.find({
          exerciseUid: { $in: exUids },
          userUid: uid,
        }).select(filterMeas);

        //find difference
        const newUserMeasDocs = _.differenceBy(
          programUserMeasDocs,
          userMeasDocs,
          'exerciseUid',
        );

        if (newUserMeasDocs.length > 0) {
          //create for copying user
          //add userUid
          const newMeasDocs = newUserMeasDocs.map(m => ({
            ...(m.toObject() as Object),
            userUid: uid,
          }));

          await UserExerciseMeas.insertMany(newMeasDocs);
        }
      } catch (err) {
        console.log(err);
        //continue on if something fails
      }
    }
  }
  /////////////// end meas duplication

  //send back program
  const genProgram = insertedWos.map(w => {
    const wExs = insertedExs
      .filter(e => e.workoutUid.equals(w._id))
      .map(e => {
        const eObj = e.toObject() as any;
        return {
          ...eObj,
          calcRef: e.calcRef ? parseFloat(e.calcRef.toString()) : 0,
          data: eObj.data.map((d: any) => ({
            ...d,
            predictVal: d.predictVal ? parseFloat(d.predictVal.toString()) : 0,
            performVal: d.performVal ? parseFloat(d.performVal.toString()) : 0,
          })),
        };
      });

    const healthData = insertedHealthData.find(d => d.workoutUid.equals(w._id));

    return {
      ...(w.toObject() as Object),
      exercises: wExs,
      healthData,
    };
  });

  res.send({ workouts: genProgram, program: newProgram.toObject() });

  handleGenProgramNotification(programUserUid, uid, newProgram.name).catch(
    err => console.log(err),
  );
});

export default router;
