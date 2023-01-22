const router = require('express').Router();
import ProgramTemplateWorkouts from '../../../collections/program-template-workouts';
import ProgramTemplateExercises from '../../../collections/program-template-exercises';
import ProgramTemplates from '../../../collections/program-templates';
import ProgramTemplateHealthData from '../../../collections/program-template-health-data';
import errorCatch from '../../../utils/error-catch';
import mongoose from 'mongoose';
import apicache from 'apicache';
import cacheOnlyNonOwner from '../../../utils/cache-only-non-owner';
const cache = apicache.middleware;

//fetch the workout for that specific day in which the user choose via calendar
//there might be an issue with this with accesscode
router.get(
  '/:userUid?:programUid?',
  cache('10 minutes', cacheOnlyNonOwner),
  async (req: any, res: any, next: any) => {
    //user has a id token
    //verify token
    const { uid } = req.headers;

    if (!uid) return res.status(401).send('cannot find user id.');

    const { userUid, programUid } = req.query;

    if (!userUid || !programUid)
      return res.status(400).send('Request is empty.');

    if (!mongoose.Types.ObjectId.isValid(programUid))
      return res.status(400).send('Invalid program id');

    try {
      //identify if the user has authorization and the program is private
      const programTemplate = await ProgramTemplates.findById(programUid);

      if (!programTemplate) return res.status('404').send('Program not found.');
    } catch (err) {
      console.log(err);
      return res
        .status(500)
        .send('Unexpected error occurred. Please try again.');
    }

    try {
      //fetch all the workout data (workout doc, exercise docs, and health data)
      const workoutDocs = await ProgramTemplateWorkouts.find({
        userUid,
        programTemplateUid: programUid,
      });
      const exerciseDocs = await ProgramTemplateExercises.find({
        userUid,
        programTemplateUid: programUid,
      });
      const workoutHealthData = await ProgramTemplateHealthData.find({
        userUid,
        ProgramTemplateHealthData: programUid,
      });

      if (workoutDocs.length < 1) return res.send([]);

      const workouts = workoutDocs.map(w => {
        //get all exercises associated with workout
        const workoutExercises = exerciseDocs
          .filter(e => e.programWorkoutUid.equals(w._id))
          .map(e => {
            const eObj = e.toObject() as any;
            return {
              ...eObj,
              calcRef: e.calcRef ? parseFloat(e.calcRef.toString()) : 0,
              data: eObj.data.map((d: any) => ({
                ...d,
                predictVal: d.predictVal
                  ? parseFloat(d.predictVal.toString())
                  : 0,
              })),
            };
          });

        const healthData = workoutHealthData.find(data =>
          data.programWorkoutUid.equals(w._id),
        );

        return {
          ...(w.toObject() as Object),
          exercises: workoutExercises,
          healthData: healthData ? (healthData.toObject() as any) : undefined,
        };
      });

      res.send(workouts);
    } catch (err) {
      errorCatch(err, res, next);
    }
  },
);

export default router;
