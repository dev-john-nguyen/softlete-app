const router = require('express').Router();
import ProgramTemplates from '../../../collections/program-templates';
import ProgramTemplateWorkouts from '../../../collections/program-template-workouts';
import { isEmptyObj } from '../../../utils/validations';
import errorCatch from '../../../utils/error-catch';
import mongoose from 'mongoose';
import { WorkoutTypes } from '../../../collections/workouts';

//initiate program
//workouts are add via a different route

router.post('/', async (req: any, res: any, next: any) => {
    //user has a id token
    //verify token
    const { uid } = req.headers;

    if (!uid) return res.status(401).send("cannot find user id.")

    if (!req.body) return res.status(400).send('Invalid request');

    const {
        programTemplateUid,
        name,
        description,
        comment,
        daysFromStart,
        type
    } = req.body;

    //valid if programUid is a ObjectId
    if (!mongoose.Types.ObjectId.isValid(programTemplateUid)) return res.status(401).send("Invalid program id.")

    const workoutData = { daysFromStart, type }

    if (isEmptyObj(workoutData)) return res.status(400).send('Invalid data associated with request.');

    //ensure name is associated with strength training type
    //other types can have name as undefined
    if (type === WorkoutTypes.TraditionalStrengthTraining && (!name || typeof name !== 'string')) return res.status(400).send("Name is required with strength training")

    //check if programUid exists in Program table
    try {

        const count = await ProgramTemplates.countDocuments({ _id: programTemplateUid })

        if (count < 1) return res.status(401).send("Program id doesn't exists.")


        const newWorkoutTemplate = new ProgramTemplateWorkouts({
            userUid: uid,
            programTemplateUid: programTemplateUid,
            name,
            description,
            daysFromStart,
            comment,
            type
        })

        newWorkoutTemplate.save()
            .then((doc) => {
                res.send(doc.toObject())
            })

    } catch (err) {
        return errorCatch(err, res, next)
    }
})

export default router;