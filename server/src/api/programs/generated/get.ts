const router = require('express').Router();
import Programs from '../../../collections/programs';
import errorCatch from '../../../utils/error-catch';
import apicache from 'apicache';
import cacheOnlyNonOwner from '../../../utils/cache-only-non-owner';
const cache = apicache.middleware;

//fetch all the active program templates
router.get(
  '/:userUid?',
  cache('5 minutes', cacheOnlyNonOwner),
  (req: any, res: any, next: any) => {
    //user has a id token
    //verify token
    const { uid } = req.headers;

    if (!uid) return res.status(401).send('cannot find user id.');

    const { userUid } = req.query;

    if (!userUid) return res.status(400).send('Request is empty.');

    Programs.find({ userUid }, (err: any, docs: any) => {
      if (err) return errorCatch(err, res, next);
      if (docs.length < 1) return res.send([]);
      res.send(docs);
    });
  },
);

export default router;
