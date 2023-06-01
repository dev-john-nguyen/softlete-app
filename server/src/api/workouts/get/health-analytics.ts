import express, { NextFunction, Request, Response } from 'express';
import apicache from 'apicache';
import WorkoutHealthData from '../../../collections/workout-health-data';
import cacheOnlyNonOwner from '../../../utils/cache-only-non-owner';
import errorCatch from '../../../utils/error-catch';
import { WorkoutStatus, WorkoutTypes } from '../../../collections/workouts';
import DateTools from '../../../utils/DateTools';
const router = express.Router();
const cache = apicache.middleware;

enum DateFilterType {
  range,
  multiple,
}

type RequestQueryProps = {
  dateFilterType: DateFilterType;
  dates: string[];
  enduranceType: WorkoutTypes;
};

type Query = {
  userUid: string;
  date?: any;
};

router.get(
  '/',
  cache('10 minutes', cacheOnlyNonOwner),
  async (
    req: Request<null, null, null, RequestQueryProps>,
    res: Response,
    next: NextFunction,
  ) => {
    const { uid } = req.headers as { uid: string };
    if (!uid) return res.status(401).send('cannot find user id.');

    const { dateFilterType, dates, enduranceType } = req.query;

    if (!enduranceType) return res.status(400).send('Invalid endurance type');
    if (!dateFilterType)
      return res.status(400).send('Invalid date filter type');
    if (!dates || dates.some(d => !DateTools.isValidDateStr(d)))
      return res.status(400).send('Invalid dates');

    const query: Query = {
      userUid: uid,
    };

    dates.sort((a, b) => {
      const aDate = DateTools.strToDate(a) as Date;
      const bDate = DateTools.strToDate(b) as Date;
      return aDate.getTime() - bDate.getTime();
    });

    if (dateFilterType === DateFilterType.multiple) {
      query.date = { $in: dates };
    } else {
      query.date = { $gte: dates[0], $lte: dates[1] };
    }

    WorkoutHealthData.find(query)
      .populate({
        path: 'workoutUid',
        match: {
          status: WorkoutStatus.completed,
          type: { $regex: new RegExp(enduranceType, 'i') },
        },
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
