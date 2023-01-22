const router = require('express').Router();
import ProgramTemplates from '../../../../collections/program-templates';
import ProgramTemplateWorkouts from '../../../../collections/program-template-workouts';
import { isEmptyObj } from '../../../../utils/validations';
import errorCatch from '../../../../utils/error-catch';
import mongoose from 'mongoose';

router.post('/', async (req: any, res: any, next: any) => {
    //user has a id token
    //verify token
    const { uid } = req.headers;

    if (!uid) return res.status(401).send("cannot find user id.")

    if (!req.body) return res.status(400).send('Invalid request');

    const {
        programTemplateUid,
        _id,
        name,
        description,
        comment,
        daysFromStart,
        type
    } = req.body

    if (!mongoose.Types.ObjectId.isValid(programTemplateUid)) return res.status(401).send("Invalid program id.")

    if (!_id || !mongoose.Types.ObjectId.isValid(_id)) return res.status(401).send("Invalid workout id")


    const workoutData = {
        name,
        daysFromStart,
        type
    }

    if (isEmptyObj(workoutData)) return res.status(400).send('Invalid data associated with request.');

    const count = await ProgramTemplates.countDocuments({ _id: programTemplateUid })
        .catch(err => {
            console.log(err)
            return 0
        })

    if (count < 1) return res.status(401).send("Program id doesn't exists.")

    ProgramTemplateWorkouts.findByIdAndUpdate(_id, {
        name,
        description,
        daysFromStart,
        comment,
        type
    }, { new: true })
        .then((doc) => {
            if (doc) {
                res.send(doc.toObject())
            } else {
                res.status(500).send("Failed to update workout.")
            }
        })
        .catch(err => errorCatch(err, res, next))

})

export default router;