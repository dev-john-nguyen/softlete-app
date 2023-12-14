const router = require('express').Router();
import ProgramExercises from '../../../../collections/program-template-exercises';
import errorCatch from '../../../../utils/error-catch';
import mongoose from 'mongoose';
import apicache from 'apicache';
import cacheOnlyNonOwner from '../../../../utils/cache-only-non-owner';
const cache = apicache.middleware;

//fetch the workout for that specific day in which the user choose via calendar
router.get('/:userUid?:programWorkoutUid?', cache('10 minutes', cacheOnlyNonOwner), async (req: any, res: any, next: any) => {
    //user has a id token
    //verify token
    const { uid } = req.headers;

    if (!uid) return res.status(401).send("cannot find user id.");

    const { userUid, programWorkoutUid } = req.query;

    if (!userUid || !programWorkoutUid) return res.status(400).send('Request is empty.');

    if (!mongoose.Types.ObjectId.isValid(programWorkoutUid)) return res.status(400).send('Invalid program id');

    try {
        const docs = await ProgramExercises.find({ userUid, programWorkoutUid: programWorkoutUid })
        if (docs.length < 1) return res.send([]);
        res.send(docs);
    } catch (err) {
        errorCatch(err, res, next)
    }

})

export default router;