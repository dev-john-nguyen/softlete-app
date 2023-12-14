const router = require('express').Router();
import Workout from '../../collections/workouts';
import WorkoutExercises from '../../collections/workout-exercises';
import WorkoutHealthData from '../../collections/workout-health-data';
import errorCatch from '../../utils/error-catch';
import { Types } from 'mongoose';
import admin from 'firebase-admin';
import { removeImageFromStorage } from '../../utils/remove-media';
import WorkoutRoute from '../../collections/workout-route';

router.post('/', async (req: any, res: any, next: any) => {
    //user has a id token
    //verify token
    const { uid } = req.headers;

    if (!uid) return res.status(401).send("cannot find user id.")

    if (!req.body) return res.status(400).send('Invalid request')

    const { workoutUids } = req.body as { workoutUids: string[] };

    if (!workoutUids || !Array.isArray(workoutUids) || workoutUids.length < 1) return res.status(400).send('Invalid request')

    for (let i = 0; i < workoutUids.length; i++) {
        if (!Types.ObjectId.isValid(workoutUids[0])) return res.status(400).send('Invalid workout id');
    }

    //security purposes use uid
    try {
        //remove workout
        const Workouts = await Workout.find({ _id: { $in: workoutUids }, userUid: uid })
        await WorkoutExercises.deleteMany({ workoutUid: { $in: workoutUids }, userUid: uid })
        await WorkoutHealthData.deleteMany({ workoutUid: { $in: workoutUids }, userUid: uid })
        await WorkoutRoute.deleteMany({ workoutUid: { $in: workoutUids }, userUid: uid })

        const removeImages: string[] = []

        Workouts.forEach(w => {
            if (w.imageId) removeImages.push(w.imageId)
            w.remove()
        })

        removeImageFromStorage(uid, removeImages)

        res.send("Workout(s) removed.")
    } catch (err) {
        return errorCatch(err, res, next);
    }
})


export default router;