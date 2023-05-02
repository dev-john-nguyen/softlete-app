import Express, { NextFunction, Request, Response } from 'express';
const router = Express.Router();
import WorkoutExercises from '../../collections/workout-exercises';
import errorCatch from '../../utils/error-catch';
import mongoose from 'mongoose';
import DateTools from '../../utils/DateTools';

/*
 get all workout exercise goals that match exerciseUid
 All numbers that are equal or exceed the goal
 pass goal target via query params
*/

type RequestParamsProps = {
  exerciseUid: string;
};

type RequestQueryProps = {
  goal: string;
  startDate: string;
  endDate: string;
};

router.get(
  '/:exerciseUid',
  (
    req: Request<RequestParamsProps, null, null, RequestQueryProps>,
    res: Response,
    next: NextFunction,
  ) => {
    const { uid } = req.headers;
    if (!uid) return res.status(401).send('cannot find user id.');

    const { exerciseUid } = req.params;

    const { goal, startDate, endDate } = req.query;

    if (!goal) return res.status(400).send('Invalid goal target');

    if (
      !DateTools.isValidDateStr(startDate) ||
      !DateTools.isValidDateStr(endDate)
    )
      return res.status(400).send('Invalid dates provided');

    if (!mongoose.Types.ObjectId.isValid(exerciseUid)) {
      return res.status(400).send('Invalid exercise uid request');
    }

    // This will return all workout exercises that have a performVal that is equal or greater than the goal target
    WorkoutExercises.find({
      exerciseUid,
      'data.performVal': { $gte: goal },
      date: { $gte: startDate, $lte: endDate },
    })
      .then(data => res.send(data))
      .catch(err => errorCatch(err, res, next));
  },
);

export default router;
