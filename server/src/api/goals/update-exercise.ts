import Express, { Request, Response, NextFunction } from 'express';
import Goals from '../../collections/goals';
import DateTools from '../../utils/DateTools';
import errorCatch from '../../utils/error-catch';
const router = Express.Router();

type RequestBody = {
  userUid: string;
  name: string;
  description: string;
  goal: number;
  startDate: string;
  endDate: string;
};

router.post(
  '/',
  (req: Request<{}, {}, RequestBody>, res: Response, next: NextFunction) => {
    const { uid } = req.headers;

    if (!uid) return res.status(401).send('cannot find user id.');

    const { name, description, goal, startDate, endDate } = req.body;

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
    };

    const filter = {
      userUid: uid,
    };

    const update = {
      $push: {
        exercises: { name, description, goal, startDate, endDate },
      },
    };

    Goals.findOneAndUpdate(filter, update, options)
      .then(goal => {
        if (!goal) {
          return res.status(404).send('Failed to update/create goal.');
        }
        return res.status(200).send(goal);
      })
      .catch(err => errorCatch(err, res, next));
  },
);

export default router;
