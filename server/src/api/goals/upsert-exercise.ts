import Express, { Request, Response, NextFunction } from 'express';
import Goals, { GoalInitProps } from '../../collections/goals';
import DateTools from '../../utils/DateTools';
import errorCatch from '../../utils/error-catch';
import mongoose from 'mongoose';
import { GoalDurationType, GoalTypes } from '../../collections/types';
const router = Express.Router();

type RequestBody = {
  _id?: string;
  userUid: string;
  name: string;
  description: string;
  goal: number;
  startDate: string;
  endDate: string;
  exerciseUid: string;
  type: GoalTypes;
};

router.post(
  '/',
  (req: Request<{}, {}, RequestBody>, res: Response, next: NextFunction) => {
    const { uid } = req.headers as { uid: string };

    if (!uid) return res.status(401).send('cannot find user id.');

    const {
      _id,
      name,
      description,
      goal,
      startDate,
      endDate,
      exerciseUid,
      type,
    } = req.body;

    if (type !== GoalTypes.endurance && type !== GoalTypes.exercise) {
      return res.status(400).send('Invalid goal type provided.');
    }

    if (type === GoalTypes.exercise) {
      // validate data for exercise
      if (!exerciseUid || !mongoose.Types.ObjectId.isValid(exerciseUid)) {
        return res.status(400).send('Invalid exerciseUid request');
      }
    }

    if (
      !DateTools.isValidDateStr(startDate) ||
      !DateTools.isValidDateStr(endDate)
    ) {
      return res.status(400).send('Invalid date requests');
    }

    if (typeof goal !== 'number') {
      return res.status(400).send('Invalid goal request');
    }

    const options = {
      new: true,
      upsert: true,
      runValidators: true,
    };

    const updatedExercise: GoalInitProps = {
      name,
      userUid: uid,
      type: type,
      durationType: GoalDurationType.dateRange,
      description,
      goal,
      startDate,
      endDate,
      exerciseUid,
    };

    type Filter = {
      userUid: string;
      _id?: string;
    };

    const filter: Filter = {
      userUid: uid,
    };

    if (_id) {
      // update goal
      if (!mongoose.Types.ObjectId.isValid(_id)) {
        return res.status(400).send('Invalid goal id request');
      }
      filter._id = _id;

      Goals.findOneAndUpdate(filter, updatedExercise, options)
        .then(goal => {
          if (!goal) {
            return res.status(404).send('Failed to update/create goal.');
          }
          return res.status(200).send(goal);
        })
        .catch(err => errorCatch(err, res, next));
    } else {
      // create goal
      const newGoal = new Goals({
        ...updatedExercise,
      });
      newGoal
        .save()
        .then(goal => res.status(200).send(goal))
        .catch(err => errorCatch(err, res, next));
    }
  },
);

export default router;
