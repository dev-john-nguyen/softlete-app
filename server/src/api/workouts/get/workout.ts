const router = require('express').Router();
import Workout from '../../../collections/workouts';
import WorkoutExercises, { WorkoutExercisesProps } from '../../../collections/workout-exercises';
import WorkoutHealthData, { WorkoutHealthDataProps } from '../../../collections/workout-health-data';
import errorCatch from '../../../utils/error-catch';
import DateTools from '../../../utils/DateTools';
import mongoose from 'mongoose';
import apicache from 'apicache';
import cacheOnlyNonOwner from '../../../utils/cache-only-non-owner';
import Image, { ImagesSchemaProps } from '../../../collections/images';
const cache = apicache.middleware;

//only cache the users
router.get('/:userUid', cache('5 minutes', cacheOnlyNonOwner), async (req: any, res: any, next: any) => {
    //user has a id token
    //verify token
    const { userUid } = req.params;

    const { fromDate, toDate } = req.query;

    if (!userUid) return res.status(400).send('Request is empty.');

    if (!DateTools.isValidDateStr(fromDate) || !DateTools.isValidDateStr(toDate)) return res.status(401).send('Dates are missing or invalid.')

    try {
        const workouts = await Workout.find({
            userUid, date: {
                $gte: fromDate,
                $lte: toDate
            }
        })

        if (workouts.length < 1) return res.send([]);

        //for each workout get the workoutUid to fetch all the exercises
        let workoutUids: mongoose.Types.ObjectId[] = [];

        workouts.forEach(w => {
            workoutUids.push(w._id)
        })

        if (workoutUids.length < 1) return res.send([])

        //fetch the workout exercises
        const workoutsExercises = await WorkoutExercises.find({ userUid, workoutUid: { $in: workoutUids as mongoose.Types.ObjectId[] } })

        //fetch the workout health data
        const workoutHealthData = await WorkoutHealthData.find({ userUid, workoutUid: { $in: workoutUids as mongoose.Types.ObjectId[] } });

        //fetch workout image if exists
        //get all imageIds
        const imageIds: string[] = workouts.filter(w => w.imageId).map(w => w.imageId as string);

        let imageDocs: (ImagesSchemaProps & mongoose.Document<any, any, ImagesSchemaProps>)[] = [];

        if (imageIds.length > 0) {
            imageDocs = await Image.find({ userUid, imageId: { $in: imageIds } })
        }

        let sendWorkouts: any = [];

        workouts.forEach((w) => {
            let exercises: (WorkoutExercisesProps & mongoose.Document<any, any, WorkoutExercisesProps>)[] = [];
            let healthData: (mongoose.Document<any, any, WorkoutHealthDataProps> & WorkoutHealthDataProps & {
                _id: mongoose.Types.ObjectId;
            }) | undefined;
            let imageDoc: (ImagesSchemaProps & mongoose.Document<any, any, ImagesSchemaProps>) | undefined;

            if (workoutsExercises.length > 0) {
                exercises = workoutsExercises.filter(e => e.workoutUid.equals(w._id))
            }

            if (workoutHealthData.length > 0) {
                healthData = workoutHealthData.find(d => d.workoutUid.equals(w._id))
            }

            if (imageDocs.length > 0 && w.imageId) {
                imageDoc = imageDocs.find(i => i.imageId === w.imageId)
            }


            const mappedExs = exercises.map((e) => {
                const eObj = e.toObject();
                return {
                    ...eObj,
                    calcRef: e.calcRef ? parseFloat(e.calcRef.toString()) : 0,
                    data: eObj.data.map(d => ({
                        ...d,
                        predictVal: d.predictVal ? parseFloat(d.predictVal.toString()) : 0,
                        performVal: d.performVal ? parseFloat(d.performVal.toString()) : 0,
                    }))
                }
            })

            sendWorkouts.push({
                ...w.toObject(),
                exercises: mappedExs,
                healthData: healthData ? healthData.toObject() : undefined,
                imageUri: imageDoc ? imageDoc.url : undefined
            })
        })

        if (sendWorkouts.length < 1) return res.send([])

        res.send(sendWorkouts);

    } catch (err) {
        errorCatch(err, res, next)
    }
})

export default router;