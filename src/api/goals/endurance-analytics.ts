import Express, { NextFunction, Request, Response } from 'express';
const router = Express.Router();
import WorkoutHealthData from '../../collections/workout-health-data';
import errorCatch from '../../utils/error-catch';
import DateTools from '../../utils/DateTools';
import { WorkoutStatus } from '../../collections/workouts';
import { GoalSubTypes, GoalTypes } from '../../collections/types';

type RequestQueryProps = {
  goal: string;
  startDate: string;
  endDate: string;
  type: GoalSubTypes;
};

router.get(
  '/',
  (
    req: Request<null, null, null, RequestQueryProps>,
    res: Response,
    next: NextFunction,
  ) => {
    const { uid } = req.headers;
    if (!uid) return res.status(401).send('cannot find user id.');

    const { goal: goalQuery, startDate, endDate, type } = req.query;

    const goal = Number(goalQuery);

    if (!goal || typeof goal !== 'number')
      return res.status(400).send('Invalid goal target');

    if (
      !DateTools.isValidDateStr(startDate) ||
      !DateTools.isValidDateStr(endDate)
    )
      return res.status(400).send('Invalid dates provided');

    if (!type) return res.status(400).send('Invalid goal type');

    const filter: any = {
      date: { $gte: startDate, $lte: endDate },
    };

    switch (type) {
      case GoalSubTypes.endurance_distance:
        filter.distance = { $gte: goal };
        break;
      case GoalSubTypes.endurance_duration:
        filter.duration = { $gte: goal };
        break;
      case GoalSubTypes.endurance_avg_pace:
        filter.$expr = { $gt: [{ $divide: ['$duration', '$distance'] }, goal] };
        break;
      default:
        return res.status(400).send('Invalid goal type');
    }

    WorkoutHealthData.find(filter)
      .populate({
        path: 'workoutUid',
        match: { status: WorkoutStatus.completed },
      })
      .then(data => {
        if (data.length < 1) return res.status(200).send([]);
        const filteredDocs = data
          .filter(doc => doc.workoutUid !== null)
          .map(doc => {
            const { workoutUid: workoutProps, ...docJSON } = doc.toJSON();
            return {
              ...docJSON,
              workout: workoutProps,
            };
          });
        return res.status(200).send(filteredDocs);
      })
      .catch(err => errorCatch(err, res, next));
  },
);

export default router;
