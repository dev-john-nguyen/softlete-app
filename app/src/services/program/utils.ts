import { ProgramWorkoutProps, ProgramProps, GeneratedProgramProps } from "./types";

export function findAndUpdateProgramWorkouts(stateWorkouts: ProgramWorkoutProps[] | GeneratedProgramProps[], newWorkouts: ProgramWorkoutProps[] | GeneratedProgramProps[]) {
    if (stateWorkouts.length < 1) return newWorkouts;

    for (let i = 0; i < newWorkouts.length; i++) {
        const newWrkout = newWorkouts[i] as ProgramWorkoutProps & GeneratedProgramProps;
        const index = stateWorkouts.findIndex((w: { _id: string }) => w._id === newWrkout._id)
        if (index >= 0) {
            //replace the fetch version with the stored verison
            stateWorkouts[index] = { ...newWrkout }
        } else {
            stateWorkouts.push(newWrkout)
        }
    }

    return [...stateWorkouts]
}

export function findAndRemoveProgramWorkout(stateWorkouts: ProgramWorkoutProps[], workoutUid: string) {
    if (stateWorkouts.length < 1) return []

    const targetIndex = stateWorkouts.findIndex(w => w._id === workoutUid);

    if (targetIndex > -1) {
        stateWorkouts.splice(targetIndex, 1);
    }

    return [...stateWorkouts]
}

export function findAndUpdateProgram(statePrograms: ProgramProps[], program: ProgramProps) {
    const targetIndex = statePrograms.findIndex(p => p._id === program._id);

    if (targetIndex > -1) {
        statePrograms[targetIndex] = program;
    }

    return [...statePrograms]
}

export function findAndRemoveProgram(statePrograms: ProgramProps[], programUid: string) {
    const targetIndex = statePrograms.findIndex(p => p._id === programUid);

    if (targetIndex > -1) {
        statePrograms.splice(targetIndex, 1)
    }
    return [...statePrograms]
}

export function findAndInsertLikeProgram(statePrograms: ProgramProps[], programUid: string, uid: string) {
    const targetIndex = statePrograms.findIndex(p => p._id === programUid);

    if (targetIndex > -1) {
        statePrograms[targetIndex].likeUids.push(uid);
    }

    return [...statePrograms]
}

export function findAndUpdateProgramWoData(stateWorkouts: ProgramWorkoutProps[], workoutUid: string, updatedData: any) {
    if (stateWorkouts.length < 1) return [];

    const foundIndex = stateWorkouts.findIndex(w => w._id === workoutUid);

    if (foundIndex > -1) {
        stateWorkouts[foundIndex] = {
            ...stateWorkouts[foundIndex],
            ...updatedData
        }
    } else {
        //insert it
        stateWorkouts.push(updatedData)
    }

    return [...stateWorkouts]
}