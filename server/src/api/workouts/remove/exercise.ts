const router = require('express').Router();
import WorkoutExercises from '../../../collections/workout-exercises';
import mongoose from 'mongoose';
import { WorkoutExercisesProps } from '../../../collections/workout-exercises';
import errorCatch from '../../../utils/error-catch';


router.post('/', async (req: any, res: any, next: any) => {
    //user has a id token
    //verify token
    const { uid } = req.headers;

    if (!uid) return res.status(401).send("cannot find user id.")

    if (!req.body) return res.status(400).send('Invalid request')

    const { exerciseUid } = req.body as { exerciseUid: string }

    if (!mongoose.Types.ObjectId.isValid(exerciseUid)) return res.status(400).send('Invalid exercise id');

    WorkoutExercises.findByIdAndDelete(exerciseUid)
        .then((doc) => {
            if (doc) {
                res.send(doc.toObject())
            } else {
                res.status(500).send("Failed to remove the exercise")
            }
        })
        .catch(err => errorCatch(err, res, next))

})

export default router;