import { AppDispatch } from "../../../App";
import { ReducerProps } from "..";
import request from "../utils/request";
import { NewProgramProps, ProgramHeaderProps, ProgramWorkoutHeaderProps, ProgramWorkoutProps, ProgramProps } from "./types";
import { SET_PROGRAM_HEADER, SET_PROGRAMS, SET_TARGET_PROGRAM, REMOVE_PROGRAM_WORKOUT, REMOVE_PROGRAM, UPDATE_PROGRAM_HEADER, SET_GENERATED_PROGRAMS, REMOVE_GENERATED_PROGRAM, UPDATE_PROGRAM_WORKOUTS, UPDATE_PROGRAM_ACCESS_CODE, UPDATE_PROGRAM_WO_HEALTH_DATA, SET_PROGRAM_VIEW_WORKOUT } from "./actionTypes";
import PATHS from "../../utils/PATHS";
import { setBanner } from "../banner/actions";
import { UPDATE_WORKOUTS, REMOVE_WORKOUTS, SET_FILTER_BY_PROGRAM } from "../workout/actionTypes";
import { WorkoutExerciseProps, WorkoutProps, DataArrProps, HealthDataProps } from "../workout/types";
import { prepareExercisesForRequest, findAndUpdateWorkoutExercises, isInvalidExerciseData } from "../workout/utils";
import { insertExercises, insertExercisesIntoWorkouts } from "../exercises/actions";
import _ from "lodash";
import processImage from "../utils/save-image";
import { SET_ATHLETE_PROGRAMS, SET_ATHLETE_GEN_PROGRAMS, SET_ATHLETE_TARGET_PROGRAM, SET_ATHLETE_VIEW_WORKOUT } from "../athletes/actionTypes";
import { BannerTypes } from "../banner/types";
import removeImage from "../utils/remove-media";
import { prefetchProgramImages } from "../utils/prefetch-images";

export const updateProgramHeader = (programData: NewProgramProps, imageBase64?: string) => async (dispatch: AppDispatch, getState: () => ReducerProps) => {

    const path = programData._id ? PATHS.programs.update : PATHS.programs.create;

    const { uid } = getState().user

    let imageUri: string | void = ''

    if (imageBase64 && programData._id) {
        //process image
        imageUri = await processImage(imageBase64, `${uid}/programs/${programData._id}`)(dispatch)

        if (imageUri) {
            programData.imageUri = imageUri
        }
    }

    request("POST", path, dispatch, programData)
        .then(async ({ data }) => {
            if (data) {
                dispatch({
                    type: programData._id ? UPDATE_PROGRAM_HEADER : SET_PROGRAM_HEADER,
                    payload: data
                })
                dispatch(setBanner(BannerTypes.default, 'Program successfully saved!'))
            }
        })
        .catch(err => console.log(err))
}

export const fetchPrograms = (athlete?: boolean) => async (dispatch: AppDispatch, getState: () => ReducerProps) => {
    let uid = '';

    if (athlete) {
        uid = getState().athletes.curAthlete.uid
    } else {
        uid = getState().user.uid
    }

    if (!uid) return;

    request("GET", PATHS.programs.get(uid), dispatch)
        .then(async ({ data }: { data?: ProgramHeaderProps[] }) => {
            if (data) {
                prefetchProgramImages(data)
                if (athlete) {
                    dispatch({ type: SET_ATHLETE_PROGRAMS, payload: data })
                } else {
                    dispatch({ type: SET_PROGRAMS, payload: data })
                }
            }
        })
        .catch(err => {
            console.log(err)
        })
}

export const setTargetProgram = (programHeader: ProgramHeaderProps, athlete?: boolean, softlete?: boolean) => async (dispatch: AppDispatch, getState: () => ReducerProps) => {
    if (!programHeader || !programHeader._id) return;

    if (!athlete) {
        //check to see if program was already fetched?
        const { programs } = getState().program;

        const storedProgram = programs.find(p => p._id === programHeader._id)

        if (storedProgram && storedProgram.workouts) {
            storedProgram.workouts = await insertExercisesIntoWorkouts(storedProgram.workouts)(dispatch, getState) as ProgramWorkoutProps[];
            dispatch({ type: SET_TARGET_PROGRAM, payload: storedProgram })
            return storedProgram
        }
    }

    let uid = '';

    if (athlete) {
        uid = getState().athletes.curAthlete.uid
    } else if (softlete) {
        uid = getState().global.softleteUid
    } else {
        uid = getState().user.uid
    }

    if (!uid) return;

    const { data }: { data?: ProgramWorkoutProps[] } = await request("GET", PATHS.programs.getWorkouts(uid, programHeader._id), dispatch)

    if (data) {
        //ensure that each data has exercises
        //fetch all the exercises assocaited with the workouts
        const workouts = await insertExercisesIntoWorkouts(data)(dispatch, getState) as ProgramWorkoutProps[];

        const genProgram: ProgramProps = {
            ...programHeader,
            workouts: workouts,
        }

        if (athlete) {
            dispatch({
                type: SET_ATHLETE_TARGET_PROGRAM,
                payload: genProgram
            })
        } else {
            dispatch({
                type: SET_TARGET_PROGRAM,
                payload: genProgram
            })
        }

        return genProgram
    }
}

export const removeProgram = (programUid: string) => async (dispatch: AppDispatch, getState: () => ReducerProps) => {
    if (!programUid) return;

    const { programs } = getState().program;

    const found = programs.find(p => p._id === programUid)

    if (found) removeImage([found.imageUri])

    const res = await request("POST", PATHS.programs.remove, dispatch, { programUid })

    if (res && res.data) {
        dispatch({
            type: REMOVE_PROGRAM,
            payload: programUid
        })
    }
}

export const updateProgramWorkoutHeader = (workoutHeader: ProgramWorkoutHeaderProps) => async (dispatch: AppDispatch) => {
    let path;

    if (!workoutHeader.programTemplateUid) return;

    if (workoutHeader._id) {
        path = PATHS.programs.updateWorkoutHeader
    } else {
        path = PATHS.programs.createWorkout
    }

    return request('POST', path, dispatch, workoutHeader)
        .then(({ data }) => {
            if (data) {
                dispatch({ type: UPDATE_PROGRAM_WORKOUTS, payload: [data] })
                dispatch({ type: SET_PROGRAM_VIEW_WORKOUT, payload: data })
            } else {
                throw 'Failed to insert or update workout header.'
            }
        })
}

export const updateProgramWorkoutExercises = (workoutUid: string, exercises: WorkoutExerciseProps[], removedExercises?: WorkoutExerciseProps[]) => async (dispatch: AppDispatch, getState: () => ReducerProps) => {
    if (!workoutUid) return;

    const saveExercises = removedExercises ? [...exercises, ...removedExercises] : [...exercises];


    const saveData = {
        _id: workoutUid,
        exercises: prepareExercisesForRequest(saveExercises)
    }

    await request('POST', PATHS.programs.updateWorkoutExercises, dispatch, saveData)
        .then(async ({ data }: { data?: WorkoutExerciseProps[] }) => {
            if (data) {
                //find workout and 

                const programWorkouts = getState().program.targetProgram.workouts;

                if (!programWorkouts) {
                    dispatch(setBanner(BannerTypes.default, "Workout doesn't exists."))
                    return;
                }

                const stateWorkout = findAndUpdateWorkoutExercises(programWorkouts, workoutUid, data);

                if (!stateWorkout) {
                    dispatch(setBanner(BannerTypes.default, "Workout doesn't exists."))
                    return;
                }

                stateWorkout.exercises = await insertExercises(stateWorkout.exercises)(dispatch, getState);

                dispatch({ type: UPDATE_PROGRAM_WORKOUTS, payload: [stateWorkout] })
                dispatch({ type: SET_PROGRAM_VIEW_WORKOUT, payload: stateWorkout })
            } else {
                throw ("Failed to update workout exercises")
            }
        })
        .catch(err => console.log(err))
}

export const setProgramViewWorkout = (workoutUid: string, programUid: string, athlete?: boolean) => async (dispatch: AppDispatch, getState: () => ReducerProps) => {
    const { user, program, athletes } = getState();

    let targetWorkout: ProgramWorkoutProps | undefined;

    const targetProgram = athlete ? athletes.targetProgram : program.programs.find(p => p._id === programUid);

    if (!targetProgram) {
        dispatch(setBanner(BannerTypes.warning, "Unable to identify the target program"))
        throw "Unable to identify the target program";
    };

    targetWorkout = targetProgram.workouts?.find(w => w._id === workoutUid);

    if (!targetWorkout) {
        dispatch(setBanner(BannerTypes.warning, "Unable to identify the target workout"))
        throw "Unable to identify the target workout"
    };

    //only fetch the exercises if haven't fetched already
    //if fetched already just send the current state to view
    if (!targetWorkout.exercises) {
        const { data } = await request("GET", PATHS.programs.getWorkoutExercises(user.uid, workoutUid), dispatch)

        targetWorkout.exercises = data ? [...data as WorkoutExerciseProps[]] : [];

        if (!athlete) {
            //update the programs state
            dispatch({ type: UPDATE_PROGRAM_WORKOUTS, payload: [targetWorkout] })
        }
    }
    //always send target to view
    athlete ? dispatch({ type: SET_ATHLETE_VIEW_WORKOUT, payload: targetWorkout }) : dispatch({ type: SET_PROGRAM_VIEW_WORKOUT, payload: targetWorkout })
}

export const duplicateProgramWorkout = (daysFromStart: number) => async (dispatch: AppDispatch, getState: () => ReducerProps) => {

    const { copiedProgramWorkout } = getState().program;

    if (!copiedProgramWorkout) return;

    const { data }: { data?: WorkoutProps } = await request("POST", PATHS.programs.duplicateWorkout, dispatch, { daysFromStart, workoutUid: copiedProgramWorkout })

    if (data) {
        //returns object of new workout
        //insert exercise propS
        const workouts = await insertExercisesIntoWorkouts([data])(dispatch, getState).catch(err => console.log(err))

        dispatch({
            type: UPDATE_PROGRAM_WORKOUTS,
            payload: workouts ? workouts : [data]
        })
    }
}

export const removeProgramWorkout = (programWorkoutUid: string) => async (dispatch: AppDispatch) => {

    const res = await request('POST', PATHS.programs.removeWorkout, dispatch, { programWorkoutUid })

    if (res && res.data) {
        dispatch({ type: REMOVE_PROGRAM_WORKOUT, payload: programWorkoutUid })
    }
}

export const removeProgramWorkoutExercise = (programWorkoutExercise: WorkoutExerciseProps) => async (dispatch: AppDispatch, getState: () => ReducerProps) => {
    request('POST', PATHS.programs.removeExercise, dispatch, { exerciseUid: programWorkoutExercise._id })
        .then(() => {
            //get current state
            const { viewWorkout } = getState().workout
            //remove the exercise
            const updatedWorkout = findAndUpdateWorkoutExercises([viewWorkout], viewWorkout._id, [{ _id: programWorkoutExercise._id, remove: true }] as any)

            //update both program states
            dispatch({ type: UPDATE_PROGRAM_WORKOUTS, payload: [updatedWorkout] })
            dispatch({ type: SET_PROGRAM_VIEW_WORKOUT, payload: updatedWorkout })
        })
        .catch(err => console.log(err))
}

export const generateProgram = (programUid: string, startDate: string, accessCode?: string) => async (dispatch: AppDispatch, getState: () => ReducerProps) => {

    const res = await request('POST', PATHS.programs.generate, dispatch, { _id: programUid, startDate: startDate, accessCode })

    if (res && res.data) {
        //data will be obj with keys workouts and program
        const { workouts, program } = res.data as { workouts: WorkoutProps[], program: ProgramProps };

        //populate workouts
        let updatedWorkouts = await insertExercisesIntoWorkouts(workouts)(dispatch, getState)

        dispatch({ type: SET_GENERATED_PROGRAMS, payload: [program] })
        dispatch({ type: UPDATE_WORKOUTS, payload: updatedWorkouts })
        dispatch(setBanner(BannerTypes.default, 'successfully generated'))
    } else {
        throw new Error()
    }
}

export const fetchGeneratedPrograms = (athlete?: boolean) => async (dispatch: AppDispatch, getState: () => ReducerProps) => {

    let uid = '';

    if (athlete) {
        uid = getState().athletes.curAthlete.uid
    } else {
        uid = getState().user.uid
    }

    if (!uid) return;

    const res = await request("GET", PATHS.programs.generated.get(uid), dispatch);

    if (res && res.data) {
        if (athlete) {
            dispatch({ type: SET_ATHLETE_GEN_PROGRAMS, payload: res.data })
        } else {
            dispatch({
                type: SET_GENERATED_PROGRAMS,
                payload: res.data
            })
        }
    }
}

export const removeGeneratedProgram = (programUid: string) => async (dispatch: AppDispatch) => {

    const res = await request("POST", PATHS.programs.generated.remove, dispatch, { programUid });

    if (res && res.data) {
        const removedWoUids = res.data as string[];

        dispatch({ type: REMOVE_GENERATED_PROGRAM, payload: programUid })
        dispatch({ type: REMOVE_WORKOUTS, payload: removedWoUids })
        dispatch({ type: SET_FILTER_BY_PROGRAM, payload: '' })
    }
}

export const updateProgramExerciseData = (dataArr: DataArrProps[]) => async (dispatch: AppDispatch, getState: () => ReducerProps) => {
    //validate data
    //remove the perform values from program template data
    const dataWoPerform = dataArr.map((d) => ({
        ...d,
        data: d.data.map(({ performVal, ...rest }) => ({ ...rest }))
    }))


    for (let i = 0; i < dataWoPerform.length; i++) {

        const { data, _id } = dataWoPerform[i];

        if (!_id) return;

        const isInvalid = isInvalidExerciseData(data, true);

        if (isInvalid) {
            dispatch(setBanner(BannerTypes.error, isInvalid))
            return;
        }
    }

    return request("POST", PATHS.programs.updateExerciseData, dispatch, { dataArr: dataWoPerform })
        .then((res) => {
            if (res && res.data) {
                //update the view workout
                const { viewWorkout } = getState().workout;

                //update the exercises
                viewWorkout.exercises = viewWorkout.exercises.map(e => {
                    const targetE = dataArr.find(d => d._id === e._id);
                    if (targetE) {
                        e.data = targetE.data
                        e.calcRef = targetE.calcRef
                    }
                    return { ...e }
                })

                const cloneWo = { ...viewWorkout }

                dispatch({
                    type: UPDATE_PROGRAM_WORKOUTS,
                    payload: [cloneWo]
                })

                dispatch({ type: SET_PROGRAM_VIEW_WORKOUT, payload: cloneWo })

                return cloneWo.exercises
            }
        })
        .catch((err) => {
            console.log(err)
        })

}

export const updateProgramAccessCode = (programUid: string, accessCode?: string) => async (dispatch: AppDispatch) => {
    return request("POST", accessCode ? PATHS.programs.removeAccessCode : PATHS.programs.addAccessCode, dispatch, { _id: programUid, accessCode: accessCode })
        .then(({ data }: { data?: string[] }) => {
            if (data) {
                dispatch({ type: UPDATE_PROGRAM_ACCESS_CODE, payload: data })
            }
        })
        .catch((err) => {
            console.log(err)
        })
}

export const updateProgramWoHealthData = (programTemplateUid: string, programWorkoutUid: string, healthData: HealthDataProps) => async (dispatch: AppDispatch) => {
    request("POST", PATHS.programs.updateWoHealthData, dispatch, {
        programWorkoutUid: programWorkoutUid,
        programTemplateUid: programTemplateUid,
        activityName: healthData.activityName,
        sourceName: healthData.sourceName,
        duration: healthData.duration,
        calories: healthData.calories,
        distance: healthData.distance,
        heartRates: healthData.heartRates
    })
        .then(({ data }: { data?: any }) => {
            if (data) {
                dispatch({
                    type: UPDATE_PROGRAM_WO_HEALTH_DATA,
                    payload: {
                        workoutUid: programWorkoutUid,
                        data: { healthData: data }
                    }
                })
            }
        })
        .catch((err) => console.log(err))
}
