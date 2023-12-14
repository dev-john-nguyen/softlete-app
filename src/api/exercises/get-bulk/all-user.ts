const router = require('express').Router();
import UserExercise from '../../../collections/user-exercises';
import SoftExercises from '../../../collections/exercises';
import errorCatch from '../../../utils/error-catch';
import apicache from 'apicache';
import cacheOnlyNonOwner from '../../../utils/cache-only-non-owner';
import fetchExerciseData from '../helpers/fetch-exercise-data';
const cache = apicache.middleware;

router.get('/:userUid?', cache('5 minutes', cacheOnlyNonOwner), async (req: any, res: any, next: any) => {
    //user has a id token
    //verify token
    const { uid } = req.headers;

    if (!uid) return res.status(401).send("cannot find user id.");

    const { userUid } = req.query;

    if (userUid && typeof userUid !== 'string') return res.status(400).send('Invalid user id.');

    try {
        const userExsDocs = await UserExercise.find({ userUid: userUid, name: { $ne: undefined } })

        if (userExsDocs.length < 1) return res.send([]);

        const exercises = await fetchExerciseData(userExsDocs, [], userUid)

        res.send(exercises)

    } catch (err) {
        return errorCatch(err, res, next)
    }
})

export default router;