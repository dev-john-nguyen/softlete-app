const router = require('express').Router();
import WorkoutRoute from '../../../collections/workout-route';
import errorCatch from '../../../utils/error-catch';
import mongoose from 'mongoose';

router.get('/:userUid', (req: any, res: any, next: any) => {
    const { userUid } = req.params;
    const { activityId, workoutUid } = req.query;

    if (!userUid) return res.status(401).send("Invalid user id");

    const criteria = { userUid, $or: [] } as any;

    if (mongoose.Types.ObjectId.isValid(workoutUid)) {
        criteria.$or.push({ workoutUid })
    }

    if (typeof activityId === 'string') {
        criteria.$or.push({ activityId })
    }

    if (criteria.$or.length < 1) return res.status(401).send("Id required.")

    WorkoutRoute.findOne(criteria)
        .then((doc) => res.send(doc))
        .catch((err) => errorCatch(err, res, next))
})

export default router;