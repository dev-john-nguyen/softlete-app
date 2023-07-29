import {
  ProgramWorkoutProps,
  ProgramProps,
  GeneratedProgramProps,
} from './types';
import cloneDeep from 'lodash/cloneDeep';

export function findAndUpdateProgramWorkouts(
  stateWorkouts: ProgramWorkoutProps[] | GeneratedProgramProps[],
  newWorkouts: ProgramWorkoutProps[] | GeneratedProgramProps[],
) {
  if (stateWorkouts.length < 1) return newWorkouts;

  for (let i = 0; i < newWorkouts.length; i++) {
    const newWrkout = newWorkouts[i] as ProgramWorkoutProps &
      GeneratedProgramProps;
    const index = stateWorkouts.findIndex(
      (w: { _id: string }) => w._id === newWrkout._id,
    );
    if (index >= 0) {
      //replace the fetch version with the stored verison
      stateWorkouts[index] = { ...newWrkout };
    } else {
      stateWorkouts.push(newWrkout);
    }
  }

  return [...stateWorkouts];
}

export function findAndRemoveProgramWorkout(
  stateWorkouts: ProgramWorkoutProps[],
  workoutUid: string,
) {
  if (stateWorkouts.length < 1) return [];

  const clonedWorkouts = cloneDeep(stateWorkouts);

  const targetIndex = clonedWorkouts.findIndex(w => w._id === workoutUid);

  if (targetIndex > -1) {
    clonedWorkouts.splice(targetIndex, 1);
  }

  return clonedWorkouts;
}

export function findAndUpdateProgram(
  statePrograms: ProgramProps[],
  program: ProgramProps,
) {
  const clonedPrograms = cloneDeep(statePrograms);
  const targetIndex = clonedPrograms.findIndex(p => p._id === program._id);

  if (targetIndex > -1) {
    clonedPrograms[targetIndex] = program;
  }

  return clonedPrograms;
}

export function findAndRemoveProgram(
  statePrograms: ProgramProps[],
  programUid: string,
) {
  const copyStatePrograms = cloneDeep(statePrograms);
  const targetIndex = copyStatePrograms.findIndex(p => p._id === programUid);

  if (targetIndex > -1) {
    copyStatePrograms.splice(targetIndex, 1);
  }
  return copyStatePrograms;
}

export function findAndInsertLikeProgram(
  statePrograms: ProgramProps[],
  programUid: string,
  uid: string,
) {
  const targetIndex = statePrograms.findIndex(p => p._id === programUid);

  if (targetIndex > -1) {
    statePrograms[targetIndex].likeUids.push(uid);
  }

  return [...statePrograms];
}

export function findAndUpdateProgramWoData(
  stateWorkouts: ProgramWorkoutProps[],
  workoutUid: string,
  updatedData: any,
) {
  if (stateWorkouts.length < 1) return [];

  const cloneStateWorkouts = cloneDeep(stateWorkouts);

  const foundIndex = cloneStateWorkouts.findIndex(w => w._id === workoutUid);

  if (foundIndex > -1) {
    cloneStateWorkouts[foundIndex] = {
      ...cloneStateWorkouts[foundIndex],
      ...updatedData,
    };
  } else {
    //insert it
    cloneStateWorkouts.push(updatedData);
  }

  return cloneStateWorkouts;
}
