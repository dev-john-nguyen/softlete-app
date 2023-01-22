const router = require('express').Router();
import UserExercise from '../../collections/user-exercises';
import errorCatch from '../../utils/error-catch';
import escapeStringRegexp from '../../utils/escape-string-regexp';
import SoftExercises from '../../collections/exercises';
import apicache from 'apicache';
import cacheOnlyNonOwner from '../../utils/cache-only-non-owner';
import fetchExerciseData from './helpers/fetch-exercise-data';

const cache = apicache.middleware;

//set a lower caching time for user exercises
router.get('/:name?:userUid?', cache('10 minutes', cacheOnlyNonOwner), async (req: any, res: any, next: any) => {
    //user has a id token
    //verify token

    const { name, userUid } = req.query;

    if (!userUid) return res.status(400).send('Request is empty.');

    const regex: any = escapeStringRegexp(name);

    const options: any = 'i';

    const parsedlimit = 50;

    try {
        const softExsDocs = await SoftExercises.find({
            name: { $regex: regex, $options: options }
        })

        const userExsDocs = await UserExercise.find({
            name: { $regex: regex, $options: options },
            userUid: userUid
        }).limit(parsedlimit);


        if (userExsDocs.length < 1 && softExsDocs.length < 1) return res.send({ empty: true })

        const exercises = await fetchExerciseData(userExsDocs, softExsDocs, userUid)

        res.send(exercises)

    } catch (err) {
        return errorCatch(err, res, next)
    }


})


export default router;