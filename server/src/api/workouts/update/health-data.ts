import express from 'express';
import WorkoutHealthData from '../../../collections/workout-health-data';
import errorCatch from '../../../utils/error-catch';
import mongoose from 'mongoose';
const router = express.Router();

router.post('/', (req: any, res: any, next: any) => {
  //user has a id token
  //verify token
  const { uid } = req.headers;
  const {
    workoutUid,
    activityName,
    sourceName,
    duration,
    calories,
    distance,
    type,
    activityId,
    heartRates,
    disMeas,
    date,
    workoutEvents,
  } = req.body;

  if (!workoutUid || !mongoose.Types.ObjectId.isValid(workoutUid))
    return res.status(401).send('Invalid workout id.');

  if (heartRates && !Array.isArray(heartRates))
    return res.status(401).send('Invalid heart rates');

  if (!date || typeof date !== 'string')
    return res.status(401).send('Invalid date');

  WorkoutHealthData.findOneAndUpdate(
    { workoutUid, userUid: uid },
    {
      activityName,
      sourceName,
      duration,
      calories,
      distance,
      type,
      activityId,
      heartRates,
      disMeas,
      date,
      workoutEvents,
    },
    {
      runValidators: true,
      new: true,
      upsert: true,
    },
  )
    .then(doc => res.send(doc.toObject()))
    .catch(err => errorCatch(err, res, next));
});

export default router;
