const router = require('express').Router();
import WorkoutExercises, { WorkoutExercisesProps } from '../../../../collections/workout-exercises';
import DateTools from '../../../../utils/DateTools';
import mongoose from 'mongoose';
import errorCatch from '../../../../utils/error-catch';
import apicache from 'apicache';
import cacheOnlyNonOwner from '../../../../utils/cache-only-non-owner';
const cache = apicache.middleware;

const invalidDateText = "Invalid date provided";
const invalidExText = "Invalid exercise id provided";

function handleMappingDocs(docs: (mongoose.Document<any, any, WorkoutExercisesProps> & WorkoutExercisesProps & {
    _id: mongoose.Types.ObjectId;
})[]) {
    return docs.map(doc => {
        const docObj = doc.toObject();
        return {
            ...docObj,
            data: docObj.data.map(d => ({
                ...d,
                predictVal: d.predictVal ? parseFloat(d.predictVal.toString()) : 0,
                performVal: d.performVal ? parseFloat(d.performVal.toString()) : 0,
            }))
        }
    })
}

function isUidInvalid(exerciseUids?: string | [string]) {
    if (!exerciseUids) return true
    if (typeof exerciseUids === 'string') {
        if (!mongoose.Types.ObjectId.isValid(exerciseUids)) return true
    } else if (exerciseUids instanceof Array) {
        const isInvalid = exerciseUids.some(uid => mongoose.Types.ObjectId.isValid(uid))
        if (isInvalid) return true
    } else {
        return true
    }
}


//analytics per dates
router.get('/dates/:userUid?:dates?:exerciseUids?', cache('5 minutes', cacheOnlyNonOwner), (req: any, res: any, next: any) => {

    const { userUid, dates, exerciseUids } = req.query;

    if (!userUid) return res.status(400).send('Request is empty.');

    if (!dates) return res.status(401).send("No dates found");

    if (typeof dates === 'string') {
        if (!DateTools.isValidDateStr(dates)) {
            return res.status(401).send(invalidDateText)
        }
    } else if (dates instanceof Array) {
        const isInvalid = dates.some(d => !DateTools.isValidDateStr(d))
        if (isInvalid) return res.status(401).send(invalidDateText)
    } else {
        return res.send([])
    }

    if (isUidInvalid(exerciseUids)) return res.status(401).send(invalidExText);

    WorkoutExercises.find({
        userUid,
        date: { "$in": typeof dates === 'string' ? [dates] : dates },
        exerciseUid: { $in: exerciseUids as string[] }
    }).select({ data: 1, date: 1, exerciseUid: 1 })
        .then((docs) => {
            const mapDocs = handleMappingDocs(docs)
            res.send(mapDocs)
        })
        .catch((err) => errorCatch(err, res, next))

})

//analytics per date range
router.get('/:userUid?:fromDate?:toDate?:exerciseUids?', cache('5 minutes', cacheOnlyNonOwner), (req: any, res: any, next: any) => {

    const { userUid, fromDate, toDate, exerciseUids } = req.query;

    if (!userUid) return res.status(400).send('Request is empty.');

    if (!DateTools.isValidDateStr(fromDate) || !DateTools.isValidDateStr(toDate)) return res.status(401).send(invalidDateText)

    if (isUidInvalid(exerciseUids)) return res.status(401).send(invalidExText);

    WorkoutExercises.find({
        userUid,
        date: {
            $gte: fromDate,
            $lte: toDate
        },
        exerciseUid: { $in: exerciseUids as string[] }
    }).select({ data: 1, date: 1, exerciseUid: 1 })
        .then((docs) => {
            const mapDocs = handleMappingDocs(docs)
            res.send(mapDocs)
        })
        .catch((err) => errorCatch(err, res, next))

})


export default router;