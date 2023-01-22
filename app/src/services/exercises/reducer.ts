import { STORE_EXERCISES, UPDATE_EXERCISE, REMOVE_EXERCISE, INSERT_EXERCISES, SET_EXERCISES_MISC, SET_TARGET_EXERCISE, REMOVE_TARGET_EXERCISE } from "./actionTypes";
import { ExerciseProps } from "./types";
import { SIGNOUT_USER } from "../user/actionTypes";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LocalStoragePaths from "../../utils/LocalStoragePaths";
import _ from "lodash";


const INITIAL_STATE = {
    data: [],
    equipments: [],
    muscleGroups: [],
    targetExercise: undefined
}

type ActionProps = {
    type: any;
    payload: any;
}


export default (state = INITIAL_STATE, action: ActionProps) => {
    let exercises: any;
    switch (action.type) {
        case SET_EXERCISES_MISC:
            return {
                ...state,
                equipments: action.payload.equipments,
                muscleGroups: action.payload.muscleGroups
            }
        case STORE_EXERCISES:
            exercises = _.uniqBy([...action.payload.exercises, ...state.data], '_id')
            storeExercisesInLocalStorage(exercises)
            return {
                ...state,
                data: exercises
            }
        case INSERT_EXERCISES:
            exercises = _.uniqBy([action.payload.exercise, ...state.data], '_id')
            storeExercisesInLocalStorage(exercises)
            return {
                ...state,
                data: exercises
            }
        case UPDATE_EXERCISE:
            exercises = _.uniqBy([action.payload.exercise, ...state.data], '_id')
            storeExercisesInLocalStorage(exercises)
            return {
                ...state,
                data: exercises
            }
        case REMOVE_EXERCISE:
            exercises = removeExercise([...state.data], action.payload._id)
            storeExercisesInLocalStorage(exercises)
            return {
                ...state,
                data: exercises
            }
        case SET_TARGET_EXERCISE:
            return {
                ...state,
                targetExercise: action.payload
            }
        case REMOVE_TARGET_EXERCISE:
            return {
                ...state,
                targetExercise: undefined
            }
        case SIGNOUT_USER:
            return INITIAL_STATE;
        default:
            return state;
    }
}

async function storeExercisesInLocalStorage(exercises: ExerciseProps[]) {
    const lsExercisesStr = await AsyncStorage.getItem(LocalStoragePaths.exercises);
    if (lsExercisesStr) {
        const lsExs = JSON.parse(lsExercisesStr) as ExerciseProps[];
        const newExs = _.uniqBy([...exercises, ...lsExs], '_id')
        await AsyncStorage.setItem(LocalStoragePaths.exercises, JSON.stringify(newExs))
    } else {
        await AsyncStorage.setItem(LocalStoragePaths.exercises, JSON.stringify(exercises))
    }
}

function removeExercise(exercises: ExerciseProps[], _id: ExerciseProps['_id']) {
    const exerciseIndex = exercises.findIndex(item => item._id === _id);

    if (exerciseIndex > -1) {
        exercises.splice(exerciseIndex, 1)
    }

    return exercises
}