import express, { NextFunction, Request, Response } from 'express';
import WorkoutHealthData, {
  WorkoutHealthDataProps,
} from '../../../collections/workout-health-data';
import errorCatch from '../../../utils/error-catch';
import mongoose from 'mongoose';
import DateTools from '../../../utils/DateTools';
const router = express.Router();

interface RequestBody extends WorkoutHealthDataProps {}

router.post(
  '/',
  (
    req: Request<null, null, RequestBody, null>,
    res: Response,
    next: NextFunction,
  ) => {
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
      time,
      workoutEvents,
    } = req.body;

    if (!workoutUid || !mongoose.Types.ObjectId.isValid(workoutUid))
      return res.status(401).send('Invalid workout id.');

    if (heartRates && !Array.isArray(heartRates))
      return res.status(401).send('Invalid heart rates');

    if (!date || !DateTools.isValidDateStr(date)) {
      return res.status(401).send('Invalid date');
    }

    const updatedData = {
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
      time,
      workoutEvents,
    };

    WorkoutHealthData.findOneAndUpdate(
      { workoutUid, userUid: uid },
      updatedData,
      {
        runValidators: true,
        new: true,
        upsert: true,
      },
    )
      .then(doc => res.send(doc.toObject()))
      .catch(err => errorCatch(err, res, next));
  },
);

export default router;
