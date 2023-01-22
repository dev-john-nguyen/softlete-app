const router = require('express').Router();
import Workout, { WorkoutProps, WorkoutStatus } from '../../collections/workouts';
import WorkoutExercises from '../../collections/workout-exercises';
import errorCatch from '../../utils/error-catch';
import { isEmptyObj, isInvalidWorkoutExercises } from '../../utils/validations';
import mongoose, { Types } from 'mongoose';
import { WorkoutExercisesProps } from '../../collections/workout-exercises';
import DateTools from '../../utils/DateTools';
import exerciseBatch from '../../utils/exercise-batch';

interface NewWorkoutProps extends WorkoutProps {
    programUid: mongoose.Types.ObjectId;
    exercises: WorkoutExercisesProps[];
    date: Date;
}

router.post('/', async (req: any, res: any, next: any) => {
    //user has a id token
    //verify token
    const { uid } = req.headers;

    if (!uid) return res.status(401).send("cannot find user id.")

    if (!req.body) return res.status(400).send('Invalid request')

    const {
        _id,
        name,
        description,
        exercises,
        isPrivate,
        programUid,
        date,
        comment,
        type
    } = req.body as NewWorkoutProps;

    const validationData = {
        name,
        description,
        exercises,
        isPrivate,
        date,
        type
    }

    //workout template will not have dates associated with it. Frequency will be applied
    if (isEmptyObj(validationData)) return res.status(400).send('Invalid data associated with request.');

    if (!_id || !Types.ObjectId.isValid(_id)) return res.status(400).send('Invalid workout id');

    if (!date || !DateTools.isValidDateStr(date)) return res.status(400).send('Invalid date requests');

    //validate exercises
    const isInvalidExercises = isInvalidWorkoutExercises(exercises);

    if (isInvalidExercises) return res.status(400).send(isInvalidExercises);

    const newWorkout: WorkoutProps = {
        userUid: uid,
        type,
        name,
        description,
        isPrivate,
        comment,
        date: date,
        status: WorkoutStatus.pending
    }

    //check programUid
    if (programUid) {
        //check if programUid is valid
        if (!Types.ObjectId.isValid(programUid)) {
            return res.status(400).send("Invalid program id associated with request.")
        }

        newWorkout.programUid = programUid
    }

    try {
        const updatedWorkout = await Workout.findByIdAndUpdate(_id, newWorkout, { new: true })

        if (!updatedWorkout) return res.status(500).send('Unable to save workout. Please try again.');

        const updatedExercise = await exerciseBatch(WorkoutExercises, exercises, updatedWorkout._id, uid)

        res.send({
            ...updatedWorkout.toObject(),
            exercises: updatedExercise
        })

    } catch (err) {
        return errorCatch(err, res, next)
    }

})

export default router;