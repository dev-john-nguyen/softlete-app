const router = require('express').Router();
import Workout, { WorkoutProps, WorkoutStatus, WorkoutTypes } from '../../collections/workouts';
import errorCatch from '../../utils/error-catch';
import { isEmptyObj } from '../../utils/validations';
import mongoose from 'mongoose';
import DateTools from '../../utils/DateTools';

interface NewWorkoutProps extends WorkoutProps {
    programUid: mongoose.Types.ObjectId;
}

//This route allows user to initiate workout W/O exercises

router.post('/', async (req: any, res: any, next: any) => {
    //user has a id token
    //verify token
    const { uid } = req.headers;

    if (!uid) return res.status(401).send("cannot find user id.")

    if (!req.body) return res.status(400).send('Invalid request')

    const { workouts } = req.body as { workouts: NewWorkoutProps[] };

    if (!workouts || !Array.isArray(workouts) || workouts.length < 1) return res.status(400).send('Invalid request')

    const workoutsStore: WorkoutProps[] = [];

    for (let i = 0; i < workouts.length; i++) {
        const { name, description, isPrivate, programUid, date, comment, status, strainRating, reflection, type } = workouts[i];

        const validationData = { isPrivate, date }

        //workout template will not have dates associated with it. Frequency will be applied
        if (isEmptyObj(validationData)) return res.status(400).send('Invalid data associated with request.')

        //ensure name is associated with strength training type
        //other types can have name as undefined
        if (type === WorkoutTypes.TraditionalStrengthTraining && (!name || typeof name !== 'string')) return res.status(400).send("Name is required with strength training")

        if (!date || !DateTools.isValidDateStr(date)) return res.status(400).send('Invalid date requests');

        const workout: WorkoutProps = {
            type: type,
            userUid: uid,
            name: name ? name : type,
            description,
            isPrivate,
            comment,
            date: date,
            status: status ? status : WorkoutStatus.pending,
            strainRating: strainRating,
            reflection: reflection
        }

        //check programUid
        if (programUid) {
            //check if programUid is valid
            if (!mongoose.Types.ObjectId.isValid(programUid)) {
                return res.status(400).send("Invalid program id associated with request.")
            }
            workout.programUid = programUid
        }

        workoutsStore.unshift(workout)
    }


    if (workoutsStore.length > 0) {
        if (workoutsStore.length === 1) {
            const newWorkout = new Workout(workoutsStore[0]);
            newWorkout.save()
                .then((doc) => {
                    res.send([doc.toObject()])
                })
                .catch(err => errorCatch(err, res, next))
        } else {
            Workout.insertMany(workoutsStore)
                .then((docs) => {
                    res.send(docs.map(doc => doc.toObject()))
                })
                .catch(err => errorCatch(err, res, next))
        }
    } else {
        res.send([])
    }
})

export default router;