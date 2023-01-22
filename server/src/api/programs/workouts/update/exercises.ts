const router = require('express').Router();
import ProgramTemplateExercises from '../../../../collections/program-template-exercises';
import ProgramTemplateWorkouts from '../../../../collections/program-template-workouts';
import { isInvalidWorkoutExercises } from '../../../../utils/validations';
import mongoose from 'mongoose';
import exerciseBatch from '../../../../utils/exercise-batch';
import errorCatch from '../../../../utils/error-catch';

router.post('/', async (req: any, res: any, next: any) => {
    //user has a id token
    //verify token
    const { uid } = req.headers;

    if (!uid) return res.status(401).send("cannot find user id.");

    const {
        _id,
        exercises,
    } = req.body

    if (!mongoose.Types.ObjectId.isValid(_id)) return res.status(400).send('Invalid workout id');

    //validate exercises
    const isInvalidExercises = isInvalidWorkoutExercises(exercises);

    if (isInvalidExercises) return res.status(400).send(isInvalidExercises);

    //find workout and update
    const workout = await ProgramTemplateWorkouts.findById(_id)
        .catch(err => {
            console.log(err)
        })

    if (!workout) return res.status(401).send("Workout does not exists");

    exercises.forEach((e: any) => {
        e.programTemplateUid = workout.programTemplateUid;
        e.programWorkoutUid = workout._id;
        e.userUid = uid;
    })

    exerciseBatch(ProgramTemplateExercises, exercises, workout._id, uid)
        .then((data) => res.send(data))
        .catch(err => errorCatch(err, res, next))
})

export default router;