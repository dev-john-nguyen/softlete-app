import Express, { Request, Response, NextFunction } from 'express';
import Goals, { GoalInitProps } from '../../collections/goals';
import errorCatch from '../../utils/error-catch';
import { GoalTypes } from '../../collections/types';
const router = Express.Router();

type RequestBody = {
  sleep: number;
  activeCalories: number;
};

router.post(
  '/',
  (req: Request<{}, {}, RequestBody>, res: Response, next: NextFunction) => {
    const { uid } = req.headers as { uid: string };

    if (!uid) return res.status(401).send('cannot find user id.');

    const { sleep, activeCalories } = req.body;

    const formatGoalHandler = (
      type: GoalTypes.active_calories | GoalTypes.sleep,
      goal: number,
    ) => {
      return {
        name: type,
        userUid: uid,
        type,
        goal,
      } as GoalInitProps;
    };

    const options = {
      new: true,
      upsert: true,
      runValidators: true,
    };

    const sleepFormatted = formatGoalHandler(GoalTypes.sleep, sleep);
    const activeCaloriesFormatted = formatGoalHandler(
      GoalTypes.active_calories,
      activeCalories,
    );

    const sleepQuery = Goals.findOneAndUpdate(
      {
        userUid: uid,
        type: GoalTypes.sleep,
      },
      sleepFormatted,
      options,
    );

    const activeCaloriesQuery = Goals.findOneAndUpdate(
      {
        userUid: uid,
        type: GoalTypes.active_calories,
      },
      activeCaloriesFormatted,
      options,
    );

    Promise.all([sleepQuery, activeCaloriesQuery])
      .then(docs => {
        res.send(docs);
      })
      .catch(error => errorCatch(error, res, next));
  },
);

export default router;
