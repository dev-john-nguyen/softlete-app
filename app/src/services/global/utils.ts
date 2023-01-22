import { ReducerProps } from "..";
import { AppDispatch } from "../../../App";
import { HealthDataProps, WorkoutExerciseProps, WorkoutHeaderProps, WorkoutProps, WorkoutStatus } from "../workout/types";
import { prepareExercisesForRequest } from "../workout/utils";
import _ from 'lodash';
import { completeWorkout, updateWorkoutStatus } from "../workout/actions";
import request from "../utils/request";
import PATHS from "../../utils/PATHS";
import processImage from "../utils/save-image";
import removeMedia from "../utils/remove-media";
import { genWoImagePath } from "../../utils/MediaPaths";
import AutoId from "../../utils/AutoId";
import DateTools from "../../utils/DateTools";

export const saveOfflineData = (parsedWos: WorkoutProps[], workouts: WorkoutProps[], callback: (msg: string) => void) => async (dispatch: AppDispatch, getState: () => ReducerProps) => {
    const diff = _(workouts).xorWith(parsedWos, _.isEqual)
    if (!diff.isEmpty()) {
        callback(`updating workouts...`);
        //identified difference
        //prepare data to send to server
        //group by workout id
        const workoutGroup = diff.groupBy('_id').value()
        const keys = Object.keys(workoutGroup);

        const workoutsUpdateStore: WorkoutProps[] = [];
        const workoutHeadersStore: WorkoutHeaderProps[] = [];
        const updatedWoHealthData: HealthDataProps[] = [];

        for (let i = 0; i < keys.length; i++) {
            const values = workoutGroup[keys[i]];
            if (values.length > 1) {
                callback(`updating workout ${i + 1}/${keys.length}...`);
                const newWorkout = values[0];
                const prevWorkout = values[1];

                //check if headers are differen't
                if (
                    newWorkout.name !== prevWorkout.name ||
                    newWorkout.date !== prevWorkout.date ||
                    newWorkout.isPrivate !== prevWorkout.isPrivate ||
                    newWorkout.description !== prevWorkout.description ||
                    newWorkout.programUid !== prevWorkout.programUid
                ) {
                    //there was a change in the header
                    const { exercises, ...headerProps } = newWorkout
                    workoutHeadersStore.push(headerProps)
                }

                await updateOfflineWos(newWorkout, prevWorkout, dispatch, getState);

                //determine if the health data needs to be updated
                if (!_.isEqual(newWorkout.healthData, prevWorkout.healthData)) {
                    const { healthData } = newWorkout;
                    if (healthData) {
                        updatedWoHealthData.push({
                            workoutUid: newWorkout._id,
                            activityId: healthData.activityId,
                            activityName: healthData.activityName,
                            sourceName: healthData.sourceName,
                            duration: healthData.duration,
                            calories: healthData.calories,
                            distance: healthData.distance,
                            heartRates: healthData.heartRates,
                            disMeas: healthData.disMeas,
                            date: healthData.date
                        })
                    } else {
                        updatedWoHealthData.push({
                            workoutUid: newWorkout._id,
                            activityId: AutoId.newId(20),
                            activityName: "Activity",
                            sourceName: "",
                            duration: 0,
                            calories: 0,
                            distance: 0,
                            heartRates: [0],
                            date: new Date().toString()
                        })
                    }
                }
            } else if (values.length === 1) {
                //indicates new workout
                workoutsUpdateStore.push(values[0])
            }

        }


        //savine offline workout headers
        if (workoutHeadersStore.length > 0) await updateOfflineWoHeaders(workoutHeadersStore, callback)
        //save added new workouts and remove workouts deleted workouts
        if (workoutsUpdateStore.length > 0) await saveOfflineWos(workoutsUpdateStore, callback, getState)
        //update health data of the workouts that changed health data
        if (updatedWoHealthData.length > 0) await updateWoDataBatch(updatedWoHealthData)


        return true
    }

    return false
}

const updateWoDataBatch = async (healthData: HealthDataProps[]) => {
    return request("POST", PATHS.workouts.batch.healthData, requestCallback, { healthData })
}

const updateOfflineWoHeaders = async (headers: WorkoutHeaderProps[], callback: (msg: string) => void) => {
    if (headers.length < 1) return;
    callback("updating workout headers...")
    await request('POST', PATHS.workouts.updateHeader, requestCallback, { workouts: headers }).catch(err => {
        console.log(err)
        callback("FAILED to update workout headers")
    })
}

const updateOfflineWos = async (newWorkout: WorkoutProps, prevWorkout: WorkoutProps, dispatch: AppDispatch, getState: () => ReducerProps) => {
    if (!newWorkout._id) return;

    const saveExercises: WorkoutExerciseProps[] = []

    //find all removed exercises
    prevWorkout.exercises.forEach(e => {
        if (!newWorkout.exercises.find(ex => ex._id === e._id)) {
            //exercise was removed
            saveExercises.push({
                ...e,
                remove: true
            })
        }
    })

    //find all added exercises
    newWorkout.exercises.forEach(e => {
        saveExercises.push({ ...e })
    })

    //saving exercises and return udpated
    if (saveExercises.length > 0) {
        const saveData = {
            _id: newWorkout._id,
            exercises: prepareExercisesForRequest(saveExercises)
        }

        //with the new exercises the data will be saved
        await request('POST', PATHS.workouts.updateExercises, requestCallback, saveData)
    }


    if (newWorkout.status !== prevWorkout.status) {
        if (newWorkout.status === WorkoutStatus.completed) {
            const strainRating = newWorkout.strainRating ? newWorkout.strainRating : 0;
            const reflection = newWorkout.reflection ? newWorkout.reflection : '';
            const imageProps = { uri: newWorkout.localImageUri, base64: newWorkout.imageBase64 };

            await completeWorkout(newWorkout, strainRating, reflection, imageProps, true)(dispatch, getState);

        } else {
            await updateWorkoutStatus(newWorkout._id, newWorkout.status, true)(dispatch, getState)
        }
    }
}

const saveOfflineWos = async (workouts: WorkoutProps[], callback: (msg: string) => void, getState: () => ReducerProps) => {
    //can determine if the workout was removed by analyzing _id length
    //new workouts will have a length of 10 whereas old with have mongo id length
    const wosRemoved = workouts.filter(wo => wo._id.length > 10).map(wo => ({ _id: wo._id, imageUri: wo.imageUri }));

    if (wosRemoved.length > 0) {
        callback(`removing ${wosRemoved.length} workout(s)...`)
        const wosString = wosRemoved.map(w => w._id);
        const wosImages = wosRemoved.map(w => w.imageUri);
        removeMedia(wosImages);
        await request('POST', PATHS.workouts.remove, requestCallback, { workoutUids: wosString })
    }

    const newWorkouts = workouts.filter(wo => wo._id.length < 11);

    if (newWorkouts.length > 0) {
        callback(`saving ${newWorkouts.length} workout(s)...`)

        interface NewWorkoutProps extends WorkoutHeaderProps {
            status: WorkoutStatus;
            strainRating?: number;
            reflection?: string;
        }

        const workoutHeaders: NewWorkoutProps[] = newWorkouts.map(wo => (
            {
                name: wo.name,
                isPrivate: wo.isPrivate,
                description: wo.description,
                programUid: wo.programUid,
                date: wo.date,
                status: wo.status,
                strainRating: wo.strainRating,
                reflection: wo.reflection,
                type: wo.type
            }
        ))

        //how to determine which workout is which
        //assume it returns the same order

        const { data: savedWos }: { data?: NewWorkoutProps[] } = await request('POST', PATHS.workouts.create, requestCallback, { workouts: workoutHeaders });

        if (!savedWos || savedWos.length !== newWorkouts.length) return callback("Failed to save new workouts...");

        //exercises can be empty now because of the aerobic addition
        //filter out workouts that don't have exercises associated with them
        const workoutExercises = newWorkouts.filter(w => w.exercises && w.exercises.length > 0).map((wo, i) => {
            return {
                _id: savedWos[i]._id,
                exercises: prepareExercisesForRequest(wo.exercises)
            }
        });

        //save one at a time
        for (let i = 0; i < workoutExercises.length; i++) {
            if (workoutExercises[i].exercises.length > 0) {
                await request('POST', PATHS.workouts.updateExercises, requestCallback, workoutExercises[i])
            }
        }

        //save health data
        const workoutHealthData: any = newWorkouts.filter(w => w.healthData).map((wo, i) => {
            return {
                ...wo.healthData,
                workoutUid: savedWos[i]._id,
            }
        })

        if (workoutHealthData.length > 0) await updateWoDataBatch(workoutHealthData)

        //loop through each workout and save and fetch firestore image path
        const { uid } = getState().user;
        let woImages: { _id: string, imageId: string }[] = [];

        callback('saving images...')
        for (let i = 0; i < workoutHeaders.length; i++) {
            const wo = savedWos[i];
            const lsWo = newWorkouts[i];

            if (wo.status === WorkoutStatus.completed && lsWo.imageBase64 && lsWo.imageId) {
                const path = await processImage(lsWo.imageBase64, genWoImagePath(uid, lsWo.imageId))(requestCallback)
                if (path && wo._id) {
                    woImages.push({
                        _id: wo._id,
                        imageId: lsWo.imageId
                    })
                }
            }
        }

        if (woImages.length > 0) {
            await request("POST", PATHS.workouts.batch.images, requestCallback, { workoutsImages: woImages }).catch(err => {
                console.log(err)
                callback("FAILED to save images...")
            })
        }

    }

}

const requestCallback: any = ({ payload }: any) => {
    console.log(payload.msg)
}