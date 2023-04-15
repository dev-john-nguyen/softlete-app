import Express, { NextFunction, Request, Response } from 'express';
const router = Express.Router();
import Goals from '../../collections/goals';
import errorCatch from '../../utils/error-catch';

router.delete(
  '/:exerciseGoalUid',
  (req: Request, res: Response, next: NextFunction) => {
    const { uid } = req.headers;
    if (!uid) return res.status(401).send('cannot find user id.');
    const { exerciseGoalUid } = req.params;
    if (!exerciseGoalUid)
      return res.status(400).send('Invalid exercise goal uid');
    Goals.findOneAndUpdate(
      { userUid: uid },
      { $pull: { exercises: { _id: exerciseGoalUid } } },
      { new: true },
    )
      .then(updatedGoal => {
        if (updatedGoal) {
          res.send(updatedGoal.toObject());
        } else {
          return res.status(404).send('Failed to delete exercise goal.');
        }
      })
      .catch(err => errorCatch(err, res, next));
  },
);

export default router;
