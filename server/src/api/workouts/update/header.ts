const router = require('express').Router();
import Workout, { WorkoutProps, WorkoutStatus } from '../../../collections/workouts';
import errorCatch from '../../../utils/error-catch';
import { isEmptyObj } from '../../../utils/validations';
import mongoose from 'mongoose';
import DateTools from '../../../utils/DateTools';

interface NewWorkoutProps extends WorkoutProps {
    programUid: mongoose.Types.ObjectId;
    date: Date;
}

router.post('/', async (req: any, res: any, next: any) => {
    //user has a id token
    //verify token
    const { uid } = req.headers;

    if (!uid) return res.status(401).send("cannot find user id.")

    if (!req.body) return res.status(400).send('Invalid request')


    const { workouts } = req.body as { workouts: NewWorkoutProps[] }

    if (!workouts || !Array.isArray(workouts) || workouts.length < 1) return res.status(400).send('Invalid request');

    const batch: {
        updateOne: {
            filter: { _id: mongoose.Types.ObjectId },
            update: any
        }
    }[] = [];

    for (let i = 0; i < workouts.length; i++) {
        const { _id, name, description, isPrivate, programUid, date, status, type } = workouts[i]

        const validationData = {
            name,
            isPrivate,
            date,
            type
        }

        //workout template will not have dates associated with it. Frequency will be applied
        if (isEmptyObj(validationData)) return res.status(400).send('Invalid data associated with request.');

        if (!_id || !mongoose.Types.ObjectId.isValid(_id)) return res.status(400).send('Invalid workout id');

        if (!date || !DateTools.isValidDateStr(date)) return res.status(400).send('Invalid date requests');

        if (description && typeof description !== 'string') return res.status(400).send('Invalid description requests');

        if (status && typeof status !== 'string') return res.status(400).send('Invalid description requests');

        //check programUid
        if (programUid) {
            //check if programUid is valid

            if (typeof programUid !== 'string') return res.status(400).send('Invalid request')

            if (!mongoose.Types.ObjectId.isValid(programUid)) {
                return res.status(400).send("Invalid program id associated with request.")
            }
        }


        const updatedWorkout = {
            userUid: uid,
            type,
            name,
            description,
            isPrivate,
            date: date,
            programUid: programUid ? programUid : undefined,
            status: status ? status : WorkoutStatus.pending
        }

        batch.push({
            updateOne: {
                filter: { _id },
                update: updatedWorkout,
            }
        })

    }

    if (batch.length < 1) return res.send();

    if (batch.length === 1) {
        const { filter, update } = batch[0].updateOne;
        Workout.findByIdAndUpdate(filter._id, update, { new: true })
            .then((doc) => {
                if (doc) {
                    res.send([doc.toObject()])
                } else {
                    res.status(500).send("Failed to update workout header.")
                }
            })
            .catch(err => errorCatch(err, res, next))
    } else {
        try {
            const batchResult = await Workout.bulkWrite(batch, {});
            if (!batchResult.ok) return res.status(500).send("Failed to update workout headers.");
            const ids = batch.map((item) => item.updateOne.filter._id);
            if (ids.length < 1) return res.status(500).send("Failed to update workout headers.");
            const workoutsResults = await Workout.find({ _id: { $in: ids } })
            res.send(workoutsResults)
        } catch (err) {
            return errorCatch(err, res, next)
        }
    }

})

export default router;