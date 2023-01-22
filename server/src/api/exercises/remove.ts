const router = require('express').Router();
import UserExercise from '../../collections/user-exercises';
import Users from '../../collections/users';
import UserExerciseMeas from '../../collections/user-exercise-measurements';
import errorCatch from '../../utils/error-catch';
import mongoose from 'mongoose';
import { removeVideoFromStorage } from '../../utils/remove-media';

router.post('/', async (req: any, res: any, next: any) => {
    //user has a id token
    //verify token
    const { uid } = req.headers;

    if (!uid) return res.status(401).send("cannot find user id.")

    if (!req.body) return res.status(400).send('Invalid request')

    const _id = req.body._id;

    if (!_id || !mongoose.Types.ObjectId.isValid(_id)) return res.status(400).send('Exercise id not found.')

    try {
        const exercise = await UserExercise.findOneAndRemove({ _id: _id, userUid: uid })
        if (!exercise) return res.status(400).send('Exercise not found.');

        if (exercise.videoId) removeVideoFromStorage(uid, [exercise.videoId])

        await UserExerciseMeas.findOneAndDelete({ exerciseUid: _id, userUid: uid })
        //remove pin if exists
        await Users.findOneAndUpdate({ uid: uid }, { $pull: { pinExercises: { exerciseUid: _id } } })

        res.send('Successfully removed.')
    } catch (err) {
        return errorCatch(err, res, next);
    }
})

export default router;