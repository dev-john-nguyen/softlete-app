import express, { NextFunction, Request, Response } from 'express';
import Workout from '../../../collections/workouts';
import errorCatch from '../../../utils/error-catch';
import mongoose from 'mongoose';
import apicache from 'apicache';
import cacheOnlyNonOwner from '../../../utils/cache-only-non-owner';
import { formatWorkoutsHandler } from '../../../utils/workouts/formatters';
const cache = apicache.middleware;
const router = express.Router();

type RequestParams = {
  userUid: string;
  workoutUid: string;
};

//only cache the users
router.get(
  '/:userUid/:workoutUid',
  cache('5 minutes', cacheOnlyNonOwner),
  async (req: Request<RequestParams>, res: Response, next: NextFunction) => {
    const { userUid, workoutUid } = req.params;
    if (!userUid || !workoutUid) {
      return res.status(400).send('Found missing values in request');
    }
    if (!mongoose.Types.ObjectId.isValid(workoutUid)) {
      return res.status(400).send('Invalid workout id');
    }

    try {
      const workout = await Workout.findById(workoutUid);
      if (!workout) return res.status(404).send('Workout not found');
      const formattedWorkouts = await formatWorkoutsHandler([workout], userUid);
      return res.status(200).send(formattedWorkouts[0]);
    } catch (err) {
      return errorCatch(err, res, next);
    }
  },
);

export default router;
