const router = require('express').Router();
import ProgramTemplateHealthData from '../../../../collections/program-template-health-data';
import mongoose from 'mongoose';
import errorCatch from '../../../../utils/error-catch';

router.post('/', (req: any, res: any, next: any) => {
    //user has a id token
    //verify token
    const { uid } = req.headers;
    const { programTemplateUid, programWorkoutUid, activityName, duration, calories, distance, type, heartRates } = req.body;

    if (!programTemplateUid || !mongoose.Types.ObjectId.isValid(programTemplateUid)) return res.status(401).send("Invalid program template id.")

    if (!programWorkoutUid || !mongoose.Types.ObjectId.isValid(programWorkoutUid)) return res.status(401).send("Invalid program template id.")

    if (heartRates && !Array.isArray(heartRates)) return res.status(401).send("Invalid heart rates");

    ProgramTemplateHealthData.findOneAndUpdate({ programTemplateUid, programWorkoutUid, userUid: uid }, {
        activityName,
        duration,
        calories,
        distance,
        type,
        heartRates
    }, {
        runValidators: true,
        new: true,
        upsert: true
    })
        .then((doc) => res.send(doc.toObject()))
        .catch((err) => errorCatch(err, res, next))
})

export default router;