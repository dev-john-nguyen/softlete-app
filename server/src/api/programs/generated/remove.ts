const router = require('express').Router();
import Programs from '../../../collections/programs';
import Workouts from '../../../collections/workouts';
import WorkoutExercises from '../../../collections/workout-exercises';
import WorkoutHealthData from '../../../collections/workout-health-data';
import errorCatch from '../../../utils/error-catch';
import mongoose from 'mongoose';

router.post('/', async (req: any, res: any, next: any) => {
    //user has a id token
    //verify token
    const { uid } = req.headers;

    if (!uid) return res.status(401).send("cannot find user id.")

    if (!req.body) return res.status(400).send('Invalid request')

    const { programUid } = req.body;

    if (!mongoose.Types.ObjectId.isValid(programUid)) return res.status(400).send('Invalid workout id');

    try {
        //remove workout
        const program = await Programs.findOneAndDelete({ _id: programUid, userUid: uid })

        if (!program) return res.status(404).send("Program doesn't exists.")

        const workouts = await Workouts.find({ programUid: program._id })

        let deleteWoUids: mongoose.Types.ObjectId[] = [];

        workouts.forEach(w => {
            deleteWoUids.push(w._id)
            w.remove()
        })

        await WorkoutExercises.deleteMany({ programUid: program._id })
        await WorkoutHealthData.deleteMany({ workoutUid: { $in: deleteWoUids } })

        //send back all the workouts removed
        res.send(deleteWoUids)
    } catch (err) {
        errorCatch(err, res, next);
    }
})

export default router;