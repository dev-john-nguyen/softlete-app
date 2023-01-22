import { Types } from 'mongoose'
import { WorkoutExercisesProps } from '../collections/workout-exercises';
import { ProgramTemplateExercisesProps } from '../collections/program-template-exercises';

export default async function (Modal: any, exercises: WorkoutExercisesProps[] | ProgramTemplateExercisesProps[], workoutUid: Types.ObjectId, uid: string): Promise<WorkoutExercisesProps[]> {

    const workoutUidKey = Modal.collection.collectionName === 'workout-exercises' ? 'workoutUid' : 'programWorkoutUid'

    let removeUids: Types.ObjectId[] = [];

    //format
    //either update, insertOne, deleteMany
    //add deleteMany at the end if there is any
    const batch: any = [];

    //great bulk batch

    exercises.forEach((e: any) => {
        if (e._id) {
            if (e.remove) {
                removeUids.push(e._id)
            } else {
                //push the updated item into batch
                const { _id, ...rest } = e;
                batch.push({
                    updateOne: {
                        filter: { _id },
                        update: rest,
                    }
                })
            }
        } else {
            //new exercise added
            const { _id, remove, ...rest } = e
            batch.push({
                insertOne: {
                    document: {
                        ...rest,
                        [workoutUidKey]: workoutUid,
                        userUid: uid
                    }
                }
            })
        }
    })

    //if any remove exercises add it to the batch as deleteMany
    if (removeUids.length > 0) {
        batch.push({
            deleteMany: {
                filter: {
                    _id: { $in: removeUids }
                }
            }
        })
    }

    //no exercises 
    //right now, this should happen until I implement only updating exercises that were updated
    if (batch.length < 1) return []

    const options = {}

    //does insertOne return inserted docs

    await Modal.bulkWrite(batch, options)

    // let insertedExercises: any[] = [];

    // if (bulkRes.insertedIds) {
    //     const exerciseUids = Object.values(bulkRes.insertedIds)
    //     //fetch all exerciseUids
    //     if (exerciseUids.length > 0) {
    //         insertedExercises = await Modal.find({ _id: { $in: exerciseUids } })
    //             .then((docs: any) => docs.map((doc: any) => {
    //                 const docObj = doc.toObject();
    //                 return {
    //                     ...docObj,
    //                     calcRef: docObj.calcRef ? parseFloat(docObj.calcRef.toString()) : 0,
    //                     data: docObj.data.map((d: any) => ({
    //                         ...d,
    //                         predictVal: d.predictVal ? parseFloat(d.predictVal.toString()) : 0,
    //                         performVal: d.performVal ? parseFloat(d.performVal.toString()) : 0,
    //                     }))
    //                 }
    //             }))
    //             .catch((err: any) => {
    //                 console.log(err)
    //                 return []
    //             })
    //     }
    // }

    // const updatedExercises = batch.filter((item: any) => item.updateOne).map((item: any) => {
    //     const updatedEx = item.updateOne.update.$set
    //     return {
    //         _id: item.updateOne.filter._id,
    //         ...updatedEx,
    //         calcRef: updatedEx.calcRef ? parseFloat(updatedEx.calcRef.toString()) : 0,
    //         data: updatedEx.data.map((d: any) => ({
    //             ...d.toObject(),
    //             predictVal: d.predictVal ? parseFloat(d.predictVal.toString()) : 0,
    //             performVal: d.performVal ? parseFloat(d.performVal.toString()) : 0,
    //         }))
    //     }
    // })

    const workoutsExercises = await Modal.find({ userUid: uid, [workoutUidKey]: workoutUid })

    const mapExs = workoutsExercises.map((e: any) => {
        const eObj = e.toObject();
        return {
            ...eObj,
            calcRef: e.calcRef ? parseFloat(e.calcRef.toString()) : 0,
            data: eObj.data.map((d: any) => ({
                ...d,
                predictVal: d.predictVal ? parseFloat(d.predictVal.toString()) : 0,
                performVal: d.performVal ? parseFloat(d.performVal.toString()) : 0,
            }))
        }
    })

    return mapExs
}