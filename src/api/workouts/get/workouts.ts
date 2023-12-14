const router = require('express').Router();
import Workout from '../../../collections/workouts';
import errorCatch from '../../../utils/error-catch';
import DateTools from '../../../utils/DateTools';
import apicache from 'apicache';
import cacheOnlyNonOwner from '../../../utils/cache-only-non-owner';
import { formatWorkoutsHandler } from '../../../utils/workouts/formatters';
const cache = apicache.middleware;

//only cache the users
router.get(
  '/:userUid',
  cache('5 minutes', cacheOnlyNonOwner),
  async (req: any, res: any, next: any) => {
    //user has a id token
    //verify token
    const { userUid } = req.params;

    const { fromDate, toDate } = req.query;

    if (!userUid) return res.status(400).send('Request is empty.');

    if (
      !DateTools.isValidDateStr(fromDate) ||
      !DateTools.isValidDateStr(toDate)
    )
      return res.status(401).send('Dates are missing or invalid.');

    try {
      const workouts = await Workout.find({
        userUid,
        date: {
          $gte: fromDate,
          $lte: toDate,
        },
      });
      const formattedWos = await formatWorkoutsHandler(workouts, userUid);
      res.send(formattedWos);
    } catch (err) {
      errorCatch(err, res, next);
    }
  },
);

export default router;
