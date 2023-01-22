import { AppDispatch } from "../../../App";
import request from "../utils/request";
import PATHS from "../../utils/PATHS";
import { ReducerProps } from "..";
import { UPDATE_ANALYTICS } from "./actionTypes";
import { WorkoutExerciseProps, WorkoutProps } from "../workout/types";
import { AnalyticsProps, PinExerciseProps } from "./types";
import _ from "lodash";
import { calcAnalytics, reduceExercises, recalcAverage, calcAnalyticsData, handleAnalyticsFetched } from "./utils";
import { updateAnalyticsExercises, fetchExercises } from "../exercises/actions";
import { SET_ATHLETE_ANALYTICS } from "../athletes/actionTypes";

export const processAnalyticsExercises = (workout: WorkoutProps) => (dispatch: AppDispatch, getState: () => ReducerProps) => {
    if (!workout.exercises) return;

    const { fetchedAnalytics } = getState().misc;

    const analyticsStore = _.cloneDeep(fetchedAnalytics);

    workout.exercises.forEach(e => {
        if (e.exerciseUid) {

            const eAnal = calcAnalytics([e]);

            const foundIndex = analyticsStore.findIndex(a => a.exerciseUid === e.exerciseUid);

            if (foundIndex > -1) {
                //check if data already exists by looping through data and determine if _id unique
                const wOExIndex = analyticsStore[foundIndex].data.findIndex(dta => dta.workoutExerciseUid === e._id);
                //data already accounted for replace the data
                if (wOExIndex > -1) {
                    //update the data
                    const wOEx = analyticsStore[foundIndex].data[wOExIndex]
                    analyticsStore[foundIndex].data[wOExIndex] = {
                        ...wOEx,
                        date: workout.date,
                        data: [...e.data]
                    };
                } else {
                    //it doesn't exists so add it
                    analyticsStore[foundIndex].data.push({
                        workoutExerciseUid: e._id ? e._id : '',
                        data: [...e.data],
                        date: workout.date
                    })
                }
            } else {
                analyticsStore.push({
                    exerciseUid: e.exerciseUid,
                    exercise: e.exercise,
                    analytics: eAnal,
                    data: [{
                        workoutExerciseUid: e._id ? e._id : '',
                        data: [...e.data],
                        date: workout.date
                    }]
                })
            }
        }
    })

    //nothing was updated so no need to do more logic
    if (_.isEqual(analyticsStore, fetchedAnalytics)) return;

    //recalc all the exercises that were updated
    const newAnalyticsStore = analyticsStore.map(a => {
        const aIndex = fetchedAnalytics.findIndex(fa => fa.exerciseUid === a.exerciseUid);
        if (aIndex > -1) {
            if (_.isEqual(a, fetchedAnalytics[aIndex])) return { ...a };
        }

        return {
            ...a,
            analytics: calcAnalyticsData(a.data)
        }
    })

    dispatch({ type: UPDATE_ANALYTICS, payload: newAnalyticsStore });
}

export const fetchPinExerciseAnalytics = (fromDate: string, toDate: string, pinExercises: PinExerciseProps[], athlete?: boolean) => async (dispatch: AppDispatch, getState: () => ReducerProps) => {

    const fetchedAnalytics = await fetchExerciseAnalytics(fromDate, toDate, pinExercises.map(p => p.exerciseUid), athlete)(dispatch, getState)
        .then((res) => res ? res : [])

    let emptyPins: PinExerciseProps[] = [];

    if (fetchedAnalytics) {
        emptyPins = _.differenceBy(pinExercises, fetchedAnalytics, 'exerciseUid');
    }

    if (emptyPins.length < 1) return fetchedAnalytics;

    const exercisesStore = getState().exercises.data;

    let exerciseUidsToFetch: string[] = [];

    for (let i = 0; i < emptyPins.length; i++) {
        if (!emptyPins[i].exercise) {
            const inStore = exercisesStore.find(e => e._id === emptyPins[i].exerciseUid)
            if (inStore) {
                emptyPins[i].exercise = { ...inStore }
            } else {
                exerciseUidsToFetch.push(emptyPins[i].exerciseUid)
            }
        }
    }

    if (exerciseUidsToFetch.length > 0) {
        const exercisesFetched = await fetchExercises(_.uniq(exerciseUidsToFetch))(dispatch, getState);
        if (exercisesFetched) {
            emptyPins.forEach(p => {
                const exercise = exercisesFetched.find(fe => fe._id === p.exerciseUid)
                if (exercise) p.exercise = { ...exercise }
            })
        }
    }

    const emptyPinsAnalytics = emptyPins.map(p => {
        return {
            exerciseUid: p.exerciseUid,
            exercise: p.exercise,
            analytics: {
                min: 0,
                max: 0,
                avg: 0,
                sum: 0,
                total: 0
            },
            data: []
        }
    })

    return [...emptyPinsAnalytics, ...fetchedAnalytics]
}

export const fetchExerciseAnalytics = (fromDate: string, toDate: string, exerciseUids: string[], athlete?: boolean) => async (dispatch: AppDispatch, getState: () => ReducerProps) => {

    let uid = '';

    if (athlete) {
        uid = getState().athletes.curAthlete.uid
    } else {
        uid = getState().user.uid
    }

    if (!uid) return [];

    const uniqExerciseUids = _.uniq(exerciseUids)

    if (uniqExerciseUids.length < 1) return;

    return request("GET", PATHS.workouts.getExerciseData(fromDate, toDate, uid, uniqExerciseUids), dispatch)
        .then(async ({ data }: { data?: WorkoutExerciseProps[] }) => handleAnalyticsFetched(data, athlete)(dispatch, getState))
        .catch((err) => console.log(err))
}

export const fetchExerciseAnalyticsDates = (dates: string[], exerciseUids: string[], athlete?: boolean) => async (dispatch: AppDispatch, getState: () => ReducerProps) => {
    let uid = '';

    if (athlete) {
        uid = getState().athletes.curAthlete.uid
    } else {
        uid = getState().user.uid
    }

    if (!uid) return [];

    const uniqExerciseUids = _.uniq(exerciseUids)

    if (uniqExerciseUids.length < 1) return;

    return request("GET", PATHS.workouts.getExerciseDataByDates(dates, uniqExerciseUids, uid), dispatch)
        .then(async ({ data }: { data?: WorkoutExerciseProps[] }) => handleAnalyticsFetched(data, athlete)(dispatch, getState))
        .catch((err) => console.log(err))
}