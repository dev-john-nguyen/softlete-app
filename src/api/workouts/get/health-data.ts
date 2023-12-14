const router = require('express').Router();
import apicache from 'apicache';
import WorkoutHealthData from '../../../collections/workout-health-data';
import cacheOnlyNonOwner from '../../../utils/cache-only-non-owner';
import errorCatch from '../../../utils/error-catch';
const cache = apicache.middleware;

router.get('/:userUid?', cache('10 minutes', cacheOnlyNonOwner), async (req: any, res: any, next: any) => {
    const { userUid } = req.query;
    if (!userUid) return res.status(400).send('Request is empty.');

    WorkoutHealthData.find({ userUid: userUid })
        .then((docs) => res.send(docs))
        .catch((err) => errorCatch(err, res, next))
})

export default router;