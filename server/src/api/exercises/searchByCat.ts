const router = require('express').Router();
import errorCatch from '../../utils/error-catch';
import SoftExercises from '../../collections/exercises';
import apicache from 'apicache';
import fetchExerciseData from './helpers/fetch-exercise-data';
const cache = apicache.middleware;

router.get('/:category?', cache('10 minutes'), async (req: any, res: any, next: any) => {
    //user has a id token
    //verify token
    const { uid } = req.headers;

    if (!uid) return res.status(401).send("cannot find user id.");

    const { category } = req.query;

    if (!category) return res.send([])

    let parsedlimit = 20

    try {
        const softExsDocs = await SoftExercises.find({
            category: category
        }).limit(parsedlimit);

        if (softExsDocs.length < 1) return res.send({ empty: true })

        const exercises = await fetchExerciseData([], softExsDocs, uid);

        res.send(exercises);
    } catch (err) {
        return errorCatch(err, res, next)
    }


})


export default router;