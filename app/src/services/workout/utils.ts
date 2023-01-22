import {
  RootWorkoutProps,
  WorkoutExerciseProps,
  WorkoutProps,
  WorkoutExerciseDataProps,
  MonthWorkoutsProps,
  WorkoutStatus,
} from './types';
import DateTools from '../../utils/DateTools';
import { ProgramWorkoutProps } from '../program/types';
import { ExerciseProps } from '../exercises/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LocalStoragePaths from '../../utils/LocalStoragePaths';
import cloneDeep from 'lodash/cloneDeep';
import { Colors } from '@app/utils';

interface NewWorkoutProps {
  exercises: WorkoutExerciseProps[];
  _id: string;
}

export function getMonthWorkouts(month: number, workouts: WorkoutProps[]) {
  const thisMonthWos: WorkoutProps[] = [];

  workouts.forEach(w => {
    const wDate = DateTools.UTCISOToLocalDate(w.date);
    if (wDate.getMonth() === month) {
      thisMonthWos.push(w);
    }
  });

  return thisMonthWos;
}

export async function updateOfflineMonthWos(workouts: WorkoutProps[]) {
  //only for this months
  AsyncStorage.setItem(
    LocalStoragePaths.offlineWos,
    JSON.stringify(workouts),
  ).catch(err => console.log(err));
}

export function findAndUpdateWorkouts(
  stateWorkouts: RootWorkoutProps['workouts'],
  newWorkouts: NewWorkoutProps[],
) {
  if (stateWorkouts.length < 1) return [...newWorkouts];
  if (newWorkouts.length < 1) return [...stateWorkouts];

  const mutateStateWorkouts = [...stateWorkouts];

  for (let i = 0; i < newWorkouts.length; i++) {
    const newWrkout = newWorkouts[i];
    const index = mutateStateWorkouts.findIndex(w => w._id === newWrkout._id);
    if (index >= 0) {
      //replace the fetch version with the stored verison
      mutateStateWorkouts[index] = { ...newWrkout } as WorkoutProps;
    } else {
      //need to ensure every workout has exercises key
      if (!newWrkout.exercises) newWrkout.exercises = [];
      mutateStateWorkouts.push(newWrkout as WorkoutProps);
    }
  }

  return mutateStateWorkouts.sort(
    (a, b) =>
      DateTools.UTCISOToLocalDate(a.date).getTime() -
      DateTools.UTCISOToLocalDate(b.date).getTime(),
  );
}

export function findAndRemoveWorkout(
  stateWorkouts: RootWorkoutProps['workouts'],
  workoutUids: string[],
) {
  if (stateWorkouts.length < 1) return [];

  workoutUids.forEach(workoutUid => {
    const foundIndex = stateWorkouts.findIndex(w => w._id === workoutUid);

    if (foundIndex > -1) {
      stateWorkouts.splice(foundIndex, 1);
    }
  });

  return [...stateWorkouts];
}

export function findAllAndUpdateExerciseProps(
  stateWorkouts: WorkoutProps[],
  exercise: ExerciseProps,
) {
  for (let i = 0; i < stateWorkouts.length; i++) {
    if (!stateWorkouts[i]) return stateWorkouts;
    const { exercises } = stateWorkouts[i];
    for (let j = 0; j < exercises.length; j++) {
      const e = exercises[j];
      if (e.exerciseUid === exercise._id || e.exercise?._id === exercise._id) {
        stateWorkouts[i].exercises[j].exercise = { ...exercise };
      }
    }
  }

  return [...stateWorkouts];
}

export function findAndUpdateWorkoutExercises(
  stateWorkouts: NewWorkoutProps[] = [],
  workoutUid: string,
  exercises: WorkoutExerciseProps[],
) {
  const workout = cloneDeep(stateWorkouts).find(w => w._id === workoutUid);

  if (!workout) return;

  let { exercises: workoutExercises } = workout;

  if (!workoutExercises) {
    workoutExercises = [...exercises];
  } else {
    exercises.forEach(e => {
      const exIndex = workoutExercises.findIndex(
        we =>
          (we._id && we._id === e._id) || (we.tempId && we.tempId === e.tempId),
      );
      if (exIndex > -1) {
        if (e.remove) {
          workoutExercises.splice(exIndex, 1);
        } else {
          workoutExercises[exIndex] = e;
        }
      } else {
        workoutExercises.push(e);
      }
    });
  }

  return {
    ...workout,
    exercises: [...workoutExercises],
  } as WorkoutProps | ProgramWorkoutProps;
}

export function findAndUpdateSelectedDateWorkouts(
  selectedDate: string,
  workouts: WorkoutProps[],
  filterByProgramUid: string,
) {
  if (workouts.length < 1) return [];
  //get the workout for today's date;
  return workouts.filter(w => {
    //filter there is a program filter active check filter
    if (filterByProgramUid && filterByProgramUid !== w.programUid) return false;

    const date = DateTools.UTCISOToLocalDate(w.date);
    const dateStr = DateTools.dateToStr(date);
    if (dateStr === selectedDate) return true;
    return false;
  });
}

export function findAndUpdateWorkoutData(
  stateWorkoutsProps: RootWorkoutProps['workouts'],
  workoutUid: string,
  updatedData: any,
) {
  if (stateWorkoutsProps.length < 1) return [];

  const stateWorkouts = cloneDeep(stateWorkoutsProps);

  const foundIndex = stateWorkouts.findIndex(w => w._id === workoutUid);

  if (foundIndex > -1) {
    stateWorkouts[foundIndex] = {
      ...stateWorkouts[foundIndex],
      ...updatedData,
    };
  }

  return [...stateWorkouts];
}

export function findAndInsertLikeWo(
  stateWorkouts: RootWorkoutProps['workouts'],
  workoutUid: string,
  userLikeUid: string,
) {
  if (stateWorkouts.length < 1) return [];

  const foundIndex = stateWorkouts.findIndex(w => w._id === workoutUid);

  if (foundIndex > -1) stateWorkouts[foundIndex].likeUids?.push(userLikeUid);

  return [...stateWorkouts];
}

export function isInvalidExerciseData(
  data: WorkoutExerciseDataProps[],
  programTemplate?: boolean,
) {
  if (!data || data.length < 1) return 'Invalid data associated with request';

  for (let i = 0; i < data.length; i++) {
    const curData = data[i];
    const { predictVal, performVal, pct, reps, warmup } = curData;

    if (predictVal === null || typeof predictVal !== 'number')
      return 'Invalid predicted value associated with request';
    if (performVal && !programTemplate && typeof performVal !== 'number')
      return 'Invalid performed value associated with request';
    if (pct === null || typeof pct !== 'number')
      return 'Invalid percentage associated with request';
    if (reps === null || typeof reps !== 'number')
      return 'Invalid reps value associated with request';
    if (warmup && typeof warmup !== 'boolean') return 'Invalid warm up value';
  }
}

const getWoStatusColor = (s: WorkoutStatus) => {
  switch (s) {
    case WorkoutStatus.pending:
      return Colors.secondary;
    case WorkoutStatus.completed:
      return Colors.green;
    case WorkoutStatus.inProgress:
      return Colors.primary;
    default:
      return Colors.primary;
  }
};

export function findMonthWorkouts(
  selectedDate: string,
  stateWorkouts: RootWorkoutProps['workouts'],
  filterByProgramUid?: string,
) {
  //get month
  const d = DateTools.strToDate(selectedDate);
  if (!d) return stateWorkouts;
  const month = d.getMonth();

  const monthWorkouts: MonthWorkoutsProps = {};

  stateWorkouts.forEach((w, i) => {
    const wDate = DateTools.UTCISOToLocalDate(w.date);
    const wDateStr = DateTools.dateToStr(wDate);
    const key = w._id;
    if (wDate.getMonth() === month) {
      //if there is a filter only allow the program filter workouts to appear
      if (filterByProgramUid && filterByProgramUid !== w.programUid) return;

      const color = getWoStatusColor(w.status);

      if (monthWorkouts[wDateStr]) {
        monthWorkouts[wDateStr].dots.push({
          key,
          color: color,
        });
      } else {
        monthWorkouts[wDateStr] = {
          dots: [
            {
              key,
              color: color,
            },
          ],
        };
      }
    }
  });

  return monthWorkouts;
}

export function filterByProgram(
  programUid: string,
  stateWorkouts: RootWorkoutProps['workouts'],
) {
  if (!programUid) return [...stateWorkouts];
  return stateWorkouts.filter(w => w.programUid === programUid);
}

export function prepareExercisesForRequest(exercises: WorkoutExerciseProps[]) {
  return exercises.map(e => {
    const { tempId, exercise, _id, ...rest } = e;

    const store: any = {
      ...rest,
      exerciseUid: exercise ? exercise._id : '',
    };

    if (_id) {
      //add it to the exercises
      store._id = _id;
    }

    return store;
  });
}
