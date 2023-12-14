const router = require('express').Router();
import SoftleteExercises from '../../../collections/exercises';
import errorCatch from '../../../utils/error-catch';
import mongoose from 'mongoose';
import apicache from 'apicache';
import cacheOnlyNonOwner from '../../../utils/cache-only-non-owner';
import fetchExerciseData from '../helpers/fetch-exercise-data';
const cache = apicache.middleware;

router.get('/:exUids?:userUid?', cache('10 minutes', cacheOnlyNonOwner), async (req: any, res: any, next: any) => {
    //user has a id token
    //verify token
    const { uid } = req.headers;

    if (!uid) return res.status(401).send("cannot find user id.");

    const { exUids, userUid } = req.query;

    if (userUid && typeof userUid !== 'string') return res.status(400).send('Invalid user id.');

    if (!exUids || exUids.length < 1) return res.status(400).send('Request is empty.');

    //check if a single exUid came through
    if (typeof exUids === 'string') {
        if (!mongoose.Types.ObjectId.isValid(exUids)) return res.status(400).send('Invalid id associated with request');
    } else {
        for (let i = 0; i < exUids.length; i++) {
            if (!mongoose.Types.ObjectId.isValid(exUids[i])) return res.status(400).send('Invalid id associated with request');
        }
    }

    try {
        const softExDocs = await SoftleteExercises.find({
            _id: { $in: exUids }
        })

        if (softExDocs.length < 1) return res.send([]);

        //get list of exerciseUids
        const exUidsToFetch: mongoose.Types.ObjectId[] = [];

        softExDocs.forEach(d => {
            exUidsToFetch.push(d._id)
        })

        if (exUidsToFetch.length < 1) return res.send(softExDocs)

        const exercises = await fetchExerciseData([], softExDocs, userUid)

        res.send(exercises)

    } catch (err) {
        return errorCatch(err, res, next)
    }
})

export default router;