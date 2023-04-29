import Express, { NextFunction, Request, Response } from 'express';
const router = Express.Router();
import WorkoutExercises from '../../collections/workout-exercises';
import errorCatch from '../../utils/error-catch';
import mongoose from 'mongoose';

/*
 get all workout exercise goals that match exerciseUid
 All numbers that are equal or exceed the goal
 pass goal target via query params
*/

router.get(
  '/:exerciseUid',
  (req: Request, res: Response, next: NextFunction) => {
    const { uid } = req.headers;
    if (!uid) return res.status(401).send('cannot find user id.');
    const { exerciseUid } = req.params;
    const { goal } = req.query;
    if (!goal) return res.status(400).send('Invalid goal target');
    if (!mongoose.Types.ObjectId.isValid(exerciseUid)) {
      return res.status(400).send('Invalid exercise uid request');
    }

    // This will return all workout exercises that have a performVal that is equal or greater than the goal
    WorkoutExercises.find({ exerciseUid, 'data.performVal': { $gte: goal } })
      .then(data => res.send(data))
      .catch(err => errorCatch(err, res, next));
  },
);

export default router;
