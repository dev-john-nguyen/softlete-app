import { SIGNOUT_USER } from "../user/actionTypes";
import DateTools from "../../utils/DateTools";
import { SET_ATHLETE_WORKOUTS, SET_CURRENT_ATHLETE, SET_ATHLETE_SELECTED_DATE, SET_ATHLETE_ANALYTICS, SET_ATHLETE_GEN_PROGRAMS, SET_ATHLETE_PROGRAMS, SET_ATHLETE_VIEW_WORKOUT, SET_ATHLETE_TARGET_PROGRAM, INSERT_ATHLETE_PROFILE, INSERT_LIKE_WORKOUT, INSERT_LIKE_PROGRAM, STORE_ATHLETE_EXERCISES, SET_ATHLETE_HEALTH_DATA, SET_ATHLETE_FRIENDS } from "./actionTypes";
import { findAndUpdateWorkouts } from "../workout/utils";
import { WorkoutProps } from "../workout/types";
import _ from "lodash";


const INITIAL_STATE = {
    workouts: [],
    selectedDate: DateTools.dateToStr(new Date()),
    selectedDateWorkouts: [],
    monthWorkouts: {},
    viewWorkout: undefined,
    filterByProgramUid: '',
    curAthlete: undefined,
    fetchedAnalytics: [],
    programs: [],
    targetProgram: {},
    generatedPrograms: [],
    profiles: [],
    monthsFetched: [],
    likedWoIds: [],
    likedProgramUids: [],
    exercises: [],
    healthData: [],
    friends: []
}


export default (state = INITIAL_STATE, action: any) => {
    switch (action.type) {
        case STORE_ATHLETE_EXERCISES:
            return {
                ...state,
                exercises: action.payload
            }
        case INSERT_ATHLETE_PROFILE:
            return {
                ...state,
                profiles: _.uniqBy([...state.profiles, ...action.payload], 'uid')
            }
        case SET_ATHLETE_TARGET_PROGRAM:
            return {
                ...state,
                targetProgram: action.payload
            }
        case SET_ATHLETE_VIEW_WORKOUT:
            return {
                ...state,
                viewWorkout: action.payload
            }
        case SET_ATHLETE_GEN_PROGRAMS:
            return {
                ...state,
                generatedPrograms: action.payload
            }
        case SET_ATHLETE_PROGRAMS:
            return {
                ...state,
                programs: action.payload
            }
        case SET_ATHLETE_ANALYTICS:
            return {
                ...state,
                fetchedAnalytics: action.payload
            }
        case SET_ATHLETE_SELECTED_DATE:
            return {
                ...state,
                selectedDate: action.payload,
                selectedDateWorkouts: state.workouts
            }
        case SET_CURRENT_ATHLETE:
            return {
                ...state,
                curAthlete: action.payload,
                workouts: [],
                friends: []
            }
        case SET_ATHLETE_WORKOUTS:
            const updatedWorkouts = findAndUpdateWorkouts(state.workouts, action.payload) as WorkoutProps[];
            return {
                ...state,
                workouts: updatedWorkouts
            }
        case INSERT_LIKE_WORKOUT:
            return {
                ...state,
                likedWoIds: _.uniq([action.payload, ...state.likedWoIds])
            }
        case INSERT_LIKE_PROGRAM:
            return {
                ...state,
                likedProgramUids: _.uniq([action.payload, ...state.likedWoIds])
            }
        case SET_ATHLETE_HEALTH_DATA:
            return {
                ...state,
                healthData: action.payload
            }
        case SET_ATHLETE_FRIENDS:
            return {
                ...state,
                friends: action.payload
            }
        case SIGNOUT_USER:
            return INITIAL_STATE;
        default:
            return state;
    }
}