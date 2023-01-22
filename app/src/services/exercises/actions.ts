import { Categories, ExerciseFormProps, ExerciseProps } from "./types";
import { AppDispatch } from "../../../App";
import { ReducerProps } from "..";
import { SIGNOUT_USER } from '../user/actionTypes';
import request from "../utils/request";
import PATHS from "../../utils/PATHS";
import { setBanner } from "../banner/actions";
import { STORE_EXERCISES, UPDATE_EXERCISE, REMOVE_EXERCISE, INSERT_EXERCISES, SET_EXERCISES_MISC } from "./actionTypes";
import { WorkoutProps, WorkoutExerciseProps } from "../workout/types";
import _ from "lodash";
import { AnalyticsProps, PinExerciseProps } from "../misc/types";
import ADMIN_PATHS from '../admin/ADMINPATHS';
import { BannerTypes } from "../banner/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LocalStoragePaths from "../../utils/LocalStoragePaths";
import saveVideos from "../utils/save-video";
import removeVideo from "../utils/remove-video";
import Limits from "../../utils/Limits";
import { SET_SOFTLETE_UID } from "../global/actionTypes";

export const fetchAllUserExercises = () => async (dispatch: AppDispatch, getState: () => ReducerProps) => {
    const { uid } = getState().user;

    await request('GET', PATHS.exercises.fetchAllSoftlete(uid), dispatch)
        .then(({ data }: { data?: ExerciseProps[] }) => {
            if (data) {
                dispatch(({
                    type: STORE_EXERCISES,
                    payload: { exercises: data }
                }))
            }
        })
        .catch(err => console.log(err))

    await request('GET', PATHS.exercises.fetchAllUsers(uid), dispatch)
        .then(({ data }: { data?: ExerciseProps[] }) => {

            if (data) {
                dispatch(({
                    type: STORE_EXERCISES,
                    payload: { exercises: data }
                }))
            }
        })
        .catch((err) => {
            console.log(err)
        })
}

export const createNewExercise = (exerciseProps: ExerciseFormProps, admin?: boolean) => async (dispatch: AppDispatch, getState: () => ReducerProps) => {
    let path = '';

    if (admin) {
        path = ADMIN_PATHS.exercises.create
    } else {
        const { exercises, user } = getState();

        const myExs = exercises.data.filter(e => e.userUid === user.uid);

        if (myExs.length >= Limits.maxCustomExs) {
            dispatch(setBanner(BannerTypes.warning, "You exceeded the custom amount of exercises."))
            throw 'Exceed limit';
        }

        path = PATHS.exercises.create
    }

    const { data }: { data?: ExerciseProps } = await request('POST', path, dispatch, exerciseProps);

    if (!data) throw new Error();

    if (exerciseProps.videoId && exerciseProps.localUrl && exerciseProps.localThumbnail) {
        saveVideos(exerciseProps.localUrl, exerciseProps.videoId, exerciseProps.localThumbnail)(dispatch, getState)
    }

    if (!admin) dispatch({ type: INSERT_EXERCISES, payload: { exercise: data } })
}

export const searchExercises = (query: string, limit?: number) => async (dispatch: AppDispatch, getState: () => ReducerProps) => {
    const { user, global, exercises } = getState();

    if (!user.uid) {
        dispatch({ type: SIGNOUT_USER })
        return;
    }

    //validate
    if (/[^A-Za-z0-9\s]/.test(query)) return;

    // if (global.offline) {
    //search state
    const regex = new RegExp(query.replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1").toLowerCase())
    const queryExercise = exercises.data.filter(e => e.name && regex.test(e.name.toLowerCase()))
    return queryExercise
    // }

    // //send request
    // const res = await request('GET', PATHS.exercises.search(query, user.uid, limit), dispatch);

    // if (res && res.data && !res.data.empty) {
    //     dispatch(({
    //         type: STORE_EXERCISES,
    //         payload: { exercises: res.data }
    //     }))

    //     return res.data as ExerciseProps[]
    // }
}

export const searchByCat = (category: Categories) => async (dispatch: AppDispatch, getState: () => ReducerProps) => {
    const { global, exercises } = getState();

    // if (global.offline) {
    const regex = new RegExp(category.replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1").toLowerCase())
    const queryExercise = exercises.data.filter(e => regex.test(e.category.toLowerCase()))
    return queryExercise
    // }


    // //send request
    // const res = await request('GET', PATHS.exercises.searchByCat(category), dispatch);

    // if (res && res.data && !res.data.empty) {
    //     dispatch(({
    //         type: STORE_EXERCISES,
    //         payload: { exercises: res.data }
    //     }))

    //     return res.data as ExerciseProps[]
    // }
}

export const findExercise = (name: string) => async (dispatch: AppDispatch, getState: () => ReducerProps) => {

    //check if alredy in state
    const exercises = getState().exercises.data;

    name = name.trimStart();
    name = name.trimEnd();

    const foundEx = exercises.find(e => e.name && e.name.toLowerCase() === name.toLowerCase());

    if (foundEx) return foundEx;

    const { uid } = getState().user;

    if (!uid) {
        dispatch({ type: SIGNOUT_USER })
        return;
    }

    //validate
    if (/[^A-Za-z0-9\s]/.test(name)) return;

    //send request
    const res = await request('GET', PATHS.exercises.find(name.toLowerCase(), uid), dispatch);

    if (res && res.data && !res.data.empty) {
        dispatch(({
            type: STORE_EXERCISES,
            payload: { exercises: [res.data] }
        }))

        return res.data as ExerciseProps
    }
}

export const updateExercise = (exerciseProps: ExerciseProps, owner?: boolean, admin?: boolean) => async (dispatch: AppDispatch, getState: () => ReducerProps) => {
    const { user, exercises } = getState();

    if (!user.uid) {
        dispatch({ type: SIGNOUT_USER })
        return;
    }

    //compare the two
    const exerciseStore = exercises.data.find(e => e._id === exerciseProps._id);

    if (!exerciseStore) {
        dispatch(setBanner(BannerTypes.warning, "Exercise doesn't exists"))
        throw new Error("Exercise doesn't exists");
    }

    //identify if there are any changes
    const dif = _.reduce(exerciseProps, function (result: any, value: any, key: any) {
        //@ts-ignore
        return _.isEqual(value, exerciseStore[key]) ? result : result.concat(key);
    }, []);

    if (dif.length < 1) {
        dispatch(setBanner(BannerTypes.default, "No changes found."))
        throw new Error("No changes found");
    }

    let path = '';

    if (owner) {
        if (admin) {
            path = ADMIN_PATHS.exercises.update
        } else {
            path = PATHS.exercises.updateProps
        }
    } else {
        path = PATHS.exercises.updateMeas
    }

    const { data }: { data?: ExerciseProps } = await request('POST', path, dispatch, exerciseProps);

    if (!data) throw new Error();

    if (exerciseProps.videoId && exerciseProps.videoId !== exerciseStore.videoId) {
        //video changed

        //if old video exists remove
        if (exerciseStore.videoId) {
            removeVideo(user.uid, exerciseStore.videoId)(dispatch, getState)
                .catch(err => console.log(err))
        }

        //save new video
        if (exerciseProps.localUrl && exerciseProps.localThumbnail) {
            saveVideos(exerciseProps.localUrl, exerciseProps.videoId, exerciseProps.localThumbnail)(dispatch, getState)
                .catch(err => console.log(err))
        }
    }

    //the url and thumbnail are not part of the update response
    //reinsert url and thumbnail if videoId did not change
    if (exerciseProps.videoId && exerciseProps.videoId === exerciseStore.videoId) {
        data.url = exerciseStore.url;
        data.thumbnail = exerciseStore.thumbnail;
    }

    dispatch({ type: UPDATE_EXERCISE, payload: { exercise: data } })
}

export const removeExercise = (_id: ExerciseProps['_id'], admin?: boolean) => async (dispatch: AppDispatch, getState: () => ReducerProps) => {

    const { exercises, user } = getState();

    const targetEx = exercises.data.find(e => e._id === _id);

    if (!targetEx) {
        dispatch(setBanner(BannerTypes.warning, "Exercise doesn't exists."))
        return;
    }

    //determine if video was 
    if (targetEx.videoId) {
        removeVideo(user.uid, targetEx.videoId)(dispatch, getState)
            .catch(err => console.log(err))
    }

    let path = PATHS.exercises.remove

    if (admin) {
        path = ADMIN_PATHS.exercises.remove
    }

    const res = await request('POST', path, dispatch, { _id: _id })
    if (!res) return;
    if (res.data) dispatch({ type: REMOVE_EXERCISE, payload: { _id: _id } })
}

export const fetchExercises = (exerciseUids: string[], athlete?: boolean) => async (dispatch: AppDispatch, getState: () => ReducerProps) => {

    let uid = '';

    const { athletes, user, global } = getState();



    if (athlete) {
        uid = athletes.curAthlete.uid;
    } else {
        uid = user.uid;
    }

    if (!uid) return;

    if (exerciseUids.length < 1) return;

    if (global.offline) {
        //search local storage
        const lsExercisesStr = await AsyncStorage.getItem(LocalStoragePaths.exercises);
        if (lsExercisesStr) {
            const localStoreExs = JSON.parse(lsExercisesStr) as ExerciseProps[];
            const filterExs = localStoreExs.filter(e => exerciseUids.find(id => id === e._id))
            return filterExs
        }
        return []
    }


    //send request
    const res = await request('GET', PATHS.exercises.fetchBulkUsers(exerciseUids, uid), dispatch);

    if (res && res.data && !athlete) {
        dispatch(({
            type: STORE_EXERCISES,
            payload: { exercises: res.data }
        }))

        return res.data as ExerciseProps[]
    }
}

export const insertExercisesIntoWorkouts = (workouts: Omit<WorkoutProps, 'date'>[], athlete?: boolean) => async (dispatch: AppDispatch, getState: () => ReducerProps) => {
    //this function updates the workout with extra data in storage or if not will fetch it from server
    for (let i = 0; i < workouts.length; i++) {
        if (workouts[i].exercises?.length > 0) {
            workouts[i].exercises = await insertExercises(workouts[i].exercises, athlete)(dispatch, getState)
        }
    }
    return workouts
}

export const insertExercises = (exercises: WorkoutExerciseProps[], athlete?: boolean) => async (dispatch: AppDispatch, getState: () => ReducerProps) => {
    //this function updates the workout with extra data in storage or if not will fetch it from server
    const { exercises: execisesReducer, athletes } = getState();

    const exercisesStore = [...execisesReducer.data, ...athletes.exercises];

    let exerciseUidsToFetch: string[] = [];

    exercises.forEach(e => {
        if (e.exerciseUid) {
            const exercise = exercisesStore.find(ex => ex._id === e.exerciseUid)

            //acccount for measurements (this fix the program with copying programs and getting the most up to date meas)
            //11/8/2021 - removed the measurements check to prevent too many requets
            if (exercise) {
                e.exercise = { ...exercise }
            } else {
                exerciseUidsToFetch.push(e.exerciseUid)
            }
        }

    })

    if (exerciseUidsToFetch.length > 0) {
        //remove duplicates
        const exercisesFetched = await fetchExercises(_.uniq(exerciseUidsToFetch), athlete)(dispatch, getState);

        if (exercisesFetched) {
            exercises.forEach(e => {
                const exercise = exercisesFetched?.find(fe => fe._id === e.exerciseUid)
                if (exercise) {
                    return e.exercise = { ...exercise }
                }
            })
        }

    }

    return exercises
}

export const updateAnalyticsExercises = (analytics: AnalyticsProps[], athlete?: boolean) => async (dispatch: AppDispatch, getState: () => ReducerProps) => {
    const exercisesStore = getState().exercises.data;
    const exerciseUidsToFetch: string[] = [];

    analytics.forEach(a => {
        const exercise = exercisesStore.find(ex => ex._id === a.exerciseUid)
        if (!exercise) {
            exerciseUidsToFetch.push(a.exerciseUid)
        } else {
            a.exercise = { ...exercise }
        }
    })

    if (exerciseUidsToFetch.length > 0) {
        //remove duplicates
        const exercisesFetched = await fetchExercises(_.uniq(exerciseUidsToFetch), athlete)(dispatch, getState);

        if (exercisesFetched) {
            analytics.forEach(a => {
                const exercise = exercisesFetched.find(fe => fe._id === a.exerciseUid)
                if (exercise) a.exercise = { ...exercise }
            })
        }

    }

    return analytics
}

export const updatePinExercisesWithExercises = (pins: PinExerciseProps[]) => async (dispatch: AppDispatch, getState: () => ReducerProps) => {
    const exercisesStore = getState().exercises.data;

    const exerciseUidsToFetch: string[] = [];

    pins.forEach(a => {
        const exercise = exercisesStore.find(ex => ex._id === a.exerciseUid)
        if (!exercise) {
            exerciseUidsToFetch.push(a.exerciseUid)
        } else {
            a.exercise = { ...exercise }
        }
    })

    if (exerciseUidsToFetch.length > 0) {
        //remove duplicates
        const exercisesFetched = await fetchExercises(_.uniq(exerciseUidsToFetch))(dispatch, getState);

        if (exercisesFetched) {
            pins.forEach(a => {
                const exercise = exercisesFetched.find(fe => fe._id === a.exerciseUid)
                if (exercise) a.exercise = { ...exercise }
            })
        }

    }

    return pins
}

export const fetchMusclesAndEquipments = () => async (dispatch: AppDispatch, getState: () => ReducerProps) => {
    //currently not configured for offline
    const { equipments } = getState().exercises;
    if (!equipments || equipments.length < 1) {
        const { data } = await request('GET', PATHS.misc.get, dispatch);
        if (data) {
            dispatch({
                type: SET_EXERCISES_MISC,
                payload: data
            })
        }
    }
}

export const fetchLocalStoreExercisesToState = () => async (dispatch: AppDispatch) => {
    await AsyncStorage.removeItem(LocalStoragePaths.exercises);
    const lsExercisesStr = await AsyncStorage.getItem(LocalStoragePaths.exercises);
    if (lsExercisesStr) {
        const lsExs = JSON.parse(lsExercisesStr) as ExerciseProps[];
        dispatch({ type: STORE_EXERCISES, payload: { exercises: lsExs } })
    }
}