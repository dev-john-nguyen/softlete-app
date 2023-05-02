import Express, { NextFunction, Request, Response } from 'express';
const router = Express.Router();
import Goals from '../../collections/goals';
import errorCatch from '../../utils/error-catch';
import mongoose from 'mongoose';

router.delete('/:goalId', (req: Request, res: Response, next: NextFunction) => {
  const { uid } = req.headers;

  if (!uid) return res.status(401).send('cannot find user id.');

  const { goalId } = req.params;

  if (!goalId || !mongoose.Types.ObjectId.isValid(goalId)) {
    return res.status(400).send('Invalid exercise goal uid');
  }

  Goals.findOneAndUpdate({ userUid: uid, _id: goalId }, { isActive: false })
    .then(() => res.send('Successfully deactived goal.'))
    .catch(err => errorCatch(err, res, next));
});

export default router;
