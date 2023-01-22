const router = require('express').Router();
import WorkoutExercises from '../../../collections/workout-exercises';
import errorCatch from '../../../utils/error-catch';
import { isInvalidWorkoutExercises } from '../../../utils/validations';
import mongoose from 'mongoose';
import Workouts from '../../../collections/workouts';
import { WorkoutExercisesProps } from '../../../collections/workout-exercises';
import exerciseBatch from '../../../utils/exercise-batch';

router.post('/', async (req: any, res: any, next: any) => {
    //user has a id token
    //verify token
    const { uid } = req.headers;

    if (!uid) return res.status(401).send("cannot find user id.")

    if (!req.body) return res.status(400).send('Invalid request')

    const {
        _id,
        exercises,
    } = req.body as {
        _id: mongoose.Types.ObjectId;
        exercises: WorkoutExercisesProps[];
    };

    if (!mongoose.Types.ObjectId.isValid(_id)) return res.status(400).send('Invalid workout id');

    if (!exercises || !Array.isArray(exercises)) return res.status(400).send("Invalid exercises");

    if (exercises.length < 1) return [];

    //validate exercises
    const isInvalidExercises = isInvalidWorkoutExercises(exercises);

    if (isInvalidExercises) return res.status(400).send(isInvalidExercises);

    //validate if workout exists
    const workoutDate = await Workouts.findById(_id)
        .then((doc) => {
            if (doc) {
                return doc.toObject().date
            }
        })
        .catch(err => {
            console.log(err)
        })

    if (!workoutDate) return res.status(400).send("Workout not found.");

    //need to insert date field into all exercises
    exercises.forEach(e => {
        e.date = workoutDate
    })

    exerciseBatch(WorkoutExercises, exercises, _id, uid)
        .then(ex => res.send(ex))
        .catch((err) => errorCatch(err, res, next))
})

export default router;