import { WorkoutHeaderProps, WorkoutProps } from '@app/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ReducerProps } from '..';

// IDEA: Can just store all the workouts into one storage key. Be easier to retrieve.

export const storeWorkoutLocalStorage = async (workout: WorkoutProps) => {
  // Might need to dispatch a notification if this fails
  return AsyncStorage.setItem(
    `workouts/${workout._id}`,
    JSON.stringify(workout),
  ).catch(error => console.error(error));
};

export const getWorkoutFromLocalStorage = async (workoutUid: string) => {
  try {
    const resp = await AsyncStorage.getItem(`workouts/${workoutUid}`);
    if (!resp) return;
    return JSON.parse(resp);
  } catch (error) {
    console.error(error);
  }
};

export const getWorkout = (getState: () => unknown) => {
  return (getState() as ReducerProps).activeWorkout.workout;
};

export const removeLocalStorageWorkout = async (workoutUid: string) => {
  return AsyncStorage.removeItem(`workouts/${workoutUid}`).catch(error =>
    console.error(error),
  );
};

export const updateLocalStorageWorkoutHeader = async (
  header: WorkoutHeaderProps,
) => {
  const workout = await getWorkoutFromLocalStorage(header._id as string);
  return storeWorkoutLocalStorage({ ...workout, ...header });
};
