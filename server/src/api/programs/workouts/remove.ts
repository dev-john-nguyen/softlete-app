const router = require('express').Router();
import ProgramWorkouts from '../../../collections/program-template-workouts';
import ProgramExercises from '../../../collections/program-template-exercises';
import ProgramTemplateHealthData from '../../../collections/program-template-health-data';
import errorCatch from '../../../utils/error-catch';
import mongoose from 'mongoose';

router.post('/', async (req: any, res: any, next: any) => {
    //user has a id token
    //verify token
    const { uid } = req.headers;

    if (!uid) return res.status(401).send("cannot find user id.")

    if (!req.body) return res.status(400).send('Invalid request')

    const { programWorkoutUid } = req.body;

    if (!mongoose.Types.ObjectId.isValid(programWorkoutUid)) return res.status(400).send('Invalid workout id');

    try {
        //remove workout
        const workout = await ProgramWorkouts.findOneAndDelete({ _id: programWorkoutUid, userUid: uid })
        if (!workout) return res.status(404).send("Workout doesn't exists.")
        //find all exercises assoicated with workout
        await ProgramExercises.deleteMany({ programWorkoutUid: workout._id })
        await ProgramTemplateHealthData.findOneAndRemove({ programWorkoutUid: workout._id })
        res.send("Workout successfully removed.")
    } catch (err) {
        errorCatch(err, res, next);
    }
})

export default router;