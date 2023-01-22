const router = require('express').Router();
import Workout from '../../../collections/workouts';
import errorCatch from '../../../utils/error-catch';
import mongoose from 'mongoose';

router.post('/', (req: any, res: any, next: any) => {
    //user has a id token
    //verify token
    const { uid } = req.headers;

    if (!uid) return res.status(401).send("cannot find user id.")

    if (!req.body) return res.status(400).send('Invalid request')

    const { _id, status } = req.body;

    if (!status) return res.status(400).send('Invalid data');

    if (!mongoose.Types.ObjectId.isValid(_id)) return res.status(400).send('Invalid workout id');

    Workout.findByIdAndUpdate(_id, { status: status })
        .then((doc) => {
            if (doc) return res.send('successfully updated status')
            res.status(500).send('Failed to update status of the workout. Please try again')
        })
        .catch((err) => errorCatch(err, res, next))
})

export default router;