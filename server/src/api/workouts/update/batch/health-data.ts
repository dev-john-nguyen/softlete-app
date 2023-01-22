const router = require('express').Router();
import WorkoutHealthData, { WorkoutHealthDataProps } from '../../../../collections/workout-health-data';
import errorCatch from '../../../../utils/error-catch';
import mongoose from 'mongoose';

router.post('/', async (req: any, res: any, next: any) => {
    //user has a id token
    //verify token
    const { uid } = req.headers;

    const { healthData } = req.body as { healthData: WorkoutHealthDataProps[] };

    if (!healthData || !Array.isArray(healthData)) return res.status(401).send("Invalid request")

    const savedArr: WorkoutHealthDataProps[] = [];

    for (let i = 0; i < healthData.length; i++) {
        const { workoutUid, activityName, sourceName, duration, calories, distance, type, activityId, heartRates, disMeas, date } = healthData[i];
        if (!workoutUid || !mongoose.Types.ObjectId.isValid(workoutUid)) return res.status(401).send("Invalid workout id.")
        if (heartRates && !Array.isArray(heartRates)) return res.status(401).send("Invalid heart rates");
        if (!date || typeof date !== 'string') return res.status(401).send("Invalid date")

        //save one at a time to run validators
        try {
            const saved = await WorkoutHealthData.findOneAndUpdate({ workoutUid, userUid: uid }, {
                activityName,
                sourceName,
                duration,
                calories,
                distance,
                type,
                activityId,
                heartRates,
                disMeas,
                date
            }, {
                runValidators: true,
                new: true,
                upsert: true
            }).then((doc) => doc.toObject())
            savedArr.push(saved)
        } catch (err) {
            return errorCatch(err, res, next);
        }
    }

    res.send(savedArr);
})

export default router;