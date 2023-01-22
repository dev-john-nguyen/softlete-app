import { AppDispatch } from "../../../App";
import { ReducerProps } from "..";
import { HealthDataProps, WorkoutProps } from "../workout/types";
import request from "../utils/request";
import { insertExercises, insertExercisesIntoWorkouts } from "../exercises/actions";
import { setBanner } from "../banner/actions";
import { SET_ATHLETE_WORKOUTS, SET_ATHLETE_VIEW_WORKOUT, INSERT_ATHLETE_PROFILE, INSERT_LIKE_WORKOUT, INSERT_LIKE_PROGRAM } from "./actionTypes";
import PATHS from "../../utils/PATHS";
import { ProgramWorkoutProps } from "../program/types";
import { FriendProps, FriendStatus } from "../user/types";
import { INSERT_FRIENDS } from "../user/actionTypes";
import ATHLETE_PATHS from './ATHLETEPATHS';
import { AthleteProfileProps } from "./types";
import { MeasSubCats, MeasCats, Categories, MuscleGroups, Equipments, ExerciseProps } from "../exercises/types";
import { BannerTypes } from "../banner/types";
import { prefetchWoImages } from "../utils/prefetch-images";


export const fetchAllAthleteExercises = (athleteUid: string) => async (dispatch: AppDispatch) => {
    return request('GET', PATHS.exercises.fetchAllUsers(athleteUid), dispatch)
        .then(({ data }: { data?: ExerciseProps[] }) => {
            return data;
        })
        .catch((err) => {
            console.log(err)
        })

}

export const fetchAthleteWorkouts = (athleteUid: string, fromDate: string, toDate: string) => async (dispatch: AppDispatch, getState: () => ReducerProps) => {

    if (!athleteUid) {
        dispatch(setBanner(BannerTypes.warning, "No athlete being viewed."))
        return;
    }

    const { data }: { data?: WorkoutProps[] } = await request('GET', PATHS.workouts.fetch(fromDate, toDate, athleteUid), dispatch).catch(err => {
        console.log(err);
        return {}
    });

    if (data) {
        if (data.length < 1) {
            return []
        } else {
            prefetchWoImages(data)
            const workouts = await insertExercisesIntoWorkouts(data, true)(dispatch, getState)
            return workouts as WorkoutProps[]
        }
    }
}

export const setAthleteViewWorkout = (workoutUid: string, isProgram?: boolean) => async (dispatch: AppDispatch, getState: () => ReducerProps) => {
    const { workouts, programs } = getState().athletes;

    let workout: WorkoutProps | ProgramWorkoutProps | undefined;

    if (isProgram) {
        for (let i = 0; i < programs.length; i++) {
            const { workouts } = programs[i];
            if (workouts) {
                workout = workouts.find(w => w._id === workoutUid)
                if (workout) break;
            }
        }
    } else {
        workout = workouts.find(w => w._id === workoutUid)
    }

    if (workout && workout.exercises) {
        workout.exercises = await insertExercises(workout.exercises, true)(dispatch, getState)
        workout.exercises = workout.exercises.map(e => {
            if (!e.exercise) {
                e.exercise = {
                    _id: Math.random().toString(),
                    description: '',
                    name: 'not found',
                    measSubCat: MeasSubCats.lb,
                    measCat: MeasCats.weight,
                    category: Categories.other,
                    muscleGroup: MuscleGroups.other,
                    equipment: Equipments.none
                }
            }
            return {
                ...e,
                data: e.data.map(d => ({
                    ...d,
                    pct: d.pct ? d.pct : 100
                }))
            }
        })

    }

    dispatch({
        type: SET_ATHLETE_VIEW_WORKOUT,
        payload: workout
    })
}

export const sendFriendRequest = (userUid: string, status: FriendStatus) => async (dispatch: AppDispatch, getState: () => ReducerProps) => {
    return request("POST", PATHS.friends.update, dispatch, { userUid, status })
        .then(({ data }: { data?: FriendProps[] }) => {
            if (data) {
                dispatch({
                    type: INSERT_FRIENDS,
                    payload: [data]
                })
            }
        })
        .catch((err) => {
            console.log(err)
        })
}

export const fetchAthleteProfiles = (userUids: string[]) => async (dispatch: AppDispatch) => {
    return request("GET", ATHLETE_PATHS.getBulk(userUids), dispatch)
        .then(({ data }: { data?: AthleteProfileProps[] }) => {
            if (data) {
                dispatch({
                    type: INSERT_ATHLETE_PROFILE,
                    payload: data
                })

                return data
            }
        })
        .catch(err => {
            console.log(err)
        })
}

export const getAthletesProfile = (userUids: string[]) => async (dispatch: AppDispatch, getState: () => ReducerProps) => {
    const { profiles } = getState().athletes;

    let athleteProfiles: AthleteProfileProps[] = [];
    const toFetchUids: string[] = [];

    userUids.forEach(id => {
        const profile = profiles.find(p => p.uid === id);
        if (profile) {
            athleteProfiles.push(profile)
        } else {
            toFetchUids.push(id)
        }
    })


    if (toFetchUids.length > 0) {
        const fetchProfiles = await fetchAthleteProfiles(toFetchUids)(dispatch);

        if (fetchProfiles) {
            athleteProfiles = athleteProfiles.concat(fetchProfiles)
        }
    }

    return athleteProfiles
}

export const likeWorkout = (workoutUid: string) => async (dispatch: AppDispatch) => {
    return request('POST', PATHS.workouts.like, dispatch, { workoutUid })
        .then(() => {
            dispatch({ type: INSERT_LIKE_WORKOUT, payload: workoutUid })
        })
        .catch((err) => {
            console.log(err)
        })
}

export const likeProgram = (programUid: string) => async (dispatch: AppDispatch) => {
    return request('POST', PATHS.programs.like, dispatch, { programUid })
        .then(() => {
            dispatch({ type: INSERT_LIKE_PROGRAM, payload: programUid })
        })
        .catch((err) => {
            console.log(err)
        })
}

export const fetchAthleteHealthData = (athleteUid: string) => async (dispatch: AppDispatch) => {
    return request('GET', PATHS.workouts.getAllHealthData(athleteUid), dispatch)
        .then(({ data }: { data?: HealthDataProps[] }) => {
            return data
        })
        .catch((err) => {
            console.log(err)
        })

}

export const getAthleteFriends = (athleteUid: string) => async (dispatch: AppDispatch) => {
    return request("GET", PATHS.friends.getFriends(athleteUid), dispatch)
        .then(({ data }: { data?: FriendProps[] }) => {
            if (data) {
                //This is removed to limit the amount of request ....
                //update 10/28 ... only fetch the pending status profiles
                const uidsToFetch: string[] = [];

                const filtered = data.filter(friend => {
                    if (friend.status === FriendStatus.accepted) {
                        const otherUser = friend.users.find(fUid => fUid !== athleteUid)
                        if (otherUser) {
                            uidsToFetch.push(otherUser)
                        }
                        return true
                    }
                    return false
                })


                uidsToFetch.length > 0 && fetchAthleteProfiles(uidsToFetch)(dispatch).catch(err => console.log(err));


                return filtered
            }
            return []
        })
        .catch((err) => {
            console.log(err)
        })
}