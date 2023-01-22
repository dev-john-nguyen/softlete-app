const router = require('express').Router();
import WorkoutRoute from '../../../collections/workout-route';
import errorCatch from '../../../utils/error-catch';
import mongoose from 'mongoose';

router.post('/', (req: any, res: any, next: any) => {
    //user has a id token
    //verify token
    const { uid } = req.headers;
    const { workoutUid, activityId, locations } = req.body;

    if (!workoutUid || !mongoose.Types.ObjectId.isValid(workoutUid)) return res.status(401).send("Invalid workout id.");

    if (activityId && typeof activityId !== 'string') return res.status(401).send("Invalid activityId");

    WorkoutRoute.findOneAndUpdate({ workoutUid, activityId, userUid: uid }, { locations }, {
        runValidators: true,
        new: true,
        upsert: true
    })
        .then((doc) => res.send(doc.toObject()))
        .catch((err) => errorCatch(err, res, next))
})

export default router;