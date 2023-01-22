import { SET_PROGRAM_HEADER, SET_PROGRAMS, SET_TARGET_PROGRAM, SET_COPIED_PROGRAM_WORKOUT, REMOVE_PROGRAM_WORKOUT, REMOVE_PROGRAM, UPDATE_PROGRAM_HEADER, SET_GENERATED_PROGRAMS, REMOVE_GENERATED_PROGRAM, UPDATE_PROGRAM_WORKOUTS, UPDATE_PROGRAM_ACCESS_CODE, INSERT_MY_PROGRAM_LIKE, UPDATE_PROGRAM_WO_HEALTH_DATA, SET_PROGRAM_VIEW_WORKOUT, SET_PROGRAM_WORKOUT_HEADER } from "./actionTypes"
import { findAndUpdateProgram, findAndRemoveProgramWorkout, findAndRemoveProgram, findAndInsertLikeProgram, findAndUpdateProgramWoData } from "./utils"
import { findAllAndUpdateExerciseProps, findAndUpdateWorkouts } from "../workout/utils";
import { ProgramWorkoutProps } from "./types";
import { SIGNOUT_USER } from "../user/actionTypes";
import { UPDATE_EXERCISE } from "../exercises/actionTypes";
import { ExerciseProps } from "../exercises/types";

const INITIAL_STATE = {
    programs: [],
    targetProgram: {},
    copiedProgramWorkout: '',
    generatedPrograms: [],
    viewWorkout: undefined,
    workoutHeader: {}
}

type ActionProps = {
    type: any;
    payload: any
}


export default (state: any = INITIAL_STATE, action: ActionProps) => {
    let newProgram;
    let updatedProgram;

    switch (action.type) {
        case UPDATE_EXERCISE:
            //only need to update all the workouts for the target program
            if (state.targetProgram && state.targetProgram.workouts) {
                const updatedProgramWorkouts = findAllAndUpdateExerciseProps(state.targetProgram.workouts, action.payload.exercise as ExerciseProps)
                return {
                    ...state,
                    targetProgram: {
                        ...state.targetProgram,
                        workouts: updatedProgramWorkouts
                    }
                }
            }
        case UPDATE_PROGRAM_ACCESS_CODE:
            updatedProgram = {
                ...state.targetProgram,
                accessCodes: action.payload
            }
            return {
                ...state,
                targetProgram: updatedProgram,
                programs: findAndUpdateProgram(state.programs, updatedProgram)
            }
        case SET_PROGRAMS:
            return {
                ...state,
                programs: action.payload
            }
        case SET_GENERATED_PROGRAMS:
            return {
                ...state,
                generatedPrograms: findAndUpdateWorkouts(state.generatedPrograms, action.payload)
            }
        case REMOVE_GENERATED_PROGRAM:
            return {
                ...state,
                generatedPrograms: findAndRemoveProgram(state.generatedPrograms, action.payload)
            }
        case SET_PROGRAM_HEADER:
            return {
                ...state,
                programs: [...state.programs, action.payload]
            }
        case UPDATE_PROGRAM_HEADER:
            updatedProgram = {
                ...state.targetProgram,
                ...action.payload
            }

            return {
                ...state,
                programs: findAndUpdateProgram(state.programs, updatedProgram),
                targetProgram: updatedProgram
            }
        case SET_TARGET_PROGRAM:
            return {
                ...state,
                programs: findAndUpdateProgram(state.programs, action.payload),
                targetProgram: action.payload
            }
        case UPDATE_PROGRAM_WORKOUTS:
            newProgram = {
                ...state.targetProgram,
                workouts: findAndUpdateWorkouts(state.targetProgram.workouts, action.payload as ProgramWorkoutProps[])
            }

            return {
                ...state,
                programs: findAndUpdateProgram(state.programs, newProgram),
                targetProgram: newProgram
            }
        case SET_COPIED_PROGRAM_WORKOUT:
            return {
                ...state,
                copiedProgramWorkout: action.payload
            }
        case REMOVE_PROGRAM_WORKOUT:
            newProgram = {
                ...state.targetProgram,
                workouts: findAndRemoveProgramWorkout(state.targetProgram.workouts, action.payload)
            }

            return {
                ...state,
                programs: findAndUpdateProgram(state.programs, newProgram),
                targetProgram: newProgram
            }
        case REMOVE_PROGRAM:
            ///remove program and it's workouts
            return {
                ...state,
                programs: findAndRemoveProgram(state.programs, action.payload),
                targetProgram: {}
            }
        case INSERT_MY_PROGRAM_LIKE:
            return {
                ...state,
                programs: findAndInsertLikeProgram(state.programs, action.payload.programUid, action.payload.uid)
            }
        case UPDATE_PROGRAM_WO_HEALTH_DATA:
            newProgram = {
                ...state.targetProgram,
                workouts: findAndUpdateProgramWoData(state.targetProgram.workouts, action.payload.workoutUid, action.payload.data)
            }
            return {
                ...state,
                targetProgram: newProgram
            }
        case SET_PROGRAM_VIEW_WORKOUT:
            return {
                ...state,
                viewWorkout: action.payload
            }
        case SET_PROGRAM_WORKOUT_HEADER:
            return {
                ...state,
                workoutHeader: action.payload
            }
        case SIGNOUT_USER:
            return INITIAL_STATE;
        default:
            return state;
    }
}