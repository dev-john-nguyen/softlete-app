import Express, { Request, Response, NextFunction } from 'express';
import Goals from '../../collections/goals';
import errorCatch from '../../utils/error-catch';
const router = Express.Router();

type QueryParams = {
  userUid: string;
};

// get all goals associated with user
router.get(
  '/:userUid',
  (req: Request<QueryParams>, res: Response, next: NextFunction) => {
    const { uid } = req.headers;
    if (!uid) return res.status(401).send('Cannot find user id.');

    const { userUid } = req.params;

    if (!userUid || typeof userUid !== 'string') {
      return res.status(400).send('Invalid user id.');
    }

    Goals.find({ userUid: userUid, isActive: true })
      .then(docs => res.send(docs))
      .catch(err => errorCatch(err, res, next));
  },
);

export default router;
