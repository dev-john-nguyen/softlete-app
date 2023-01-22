import {
  ExercisesAnalyticsProps,
  AnalyticsProps,
  PinExerciseProps,
} from './types';
import { WorkoutExerciseProps } from '../workout/types';
import _ from 'lodash';
import { updateAnalyticsExercises } from '../exercises/actions';
import { AppDispatch } from '../../../App';
import { ReducerProps } from '..';
import { SET_ATHLETE_ANALYTICS } from '../athletes/actionTypes';
import { UPDATE_ANALYTICS } from './actionTypes';

export function insertOrUpdateAnalytics(
  stateFetchAnalytics: AnalyticsProps[],
  fetchedAnalytics: AnalyticsProps[],
) {
  if (!fetchedAnalytics || fetchedAnalytics.length < 1)
    return stateFetchAnalytics;

  fetchedAnalytics.forEach(a => {
    const foundIndex = stateFetchAnalytics.findIndex(
      state => state.exerciseUid === a.exerciseUid,
    );
    if (foundIndex > -1) {
      stateFetchAnalytics[foundIndex] = { ...a };
    } else {
      stateFetchAnalytics.push({ ...a });
    }
  });

  return stateFetchAnalytics;
}

export function calcAnalytics(
  exercises: WorkoutExerciseProps[],
): ExercisesAnalyticsProps {
  let performVals: number[] = [];

  exercises.forEach(e => {
    e.data.forEach(({ performVal, warmup }) => {
      if (performVal && !warmup) {
        performVals.push(performVal);
      }
    });
  });

  return calcAnalyticsInfo(performVals);
}

export function calcAnalyticsData(data: AnalyticsProps['data']) {
  let performVals: number[] = [];

  data.forEach(d => {
    d.data.forEach(({ performVal, warmup }) => {
      if (performVal && !warmup) {
        performVals.push(performVal);
      }
    });
  });

  return calcAnalyticsInfo(performVals);
}

export function calcAnalyticsInfo(performVals: number[]) {
  let min = _.min(performVals);
  let max = _.max(performVals);
  let avg = _.mean(performVals);
  let sum = _.sumBy(performVals);

  return {
    min: min ? _.round(min, 2) : 0,
    max: max ? _.round(max, 2) : 0,
    avg: avg ? _.round(avg, 2) : 0,
    sum: sum ? _.round(sum, 2) : 0,
    total: performVals.length,
  };
}

export function findPinAnalytics(
  stateFetchAnalytics: AnalyticsProps[],
  pinExercises: PinExerciseProps[],
) {
  return _.intersectionBy(stateFetchAnalytics, pinExercises, 'exerciseUid');
}

interface ExerciseObjProps {
  [exerciseUid: string]: WorkoutExerciseProps[];
}

export function reduceExercises(
  exercises: WorkoutExerciseProps[],
): ExerciseObjProps {
  return _.reduce(
    exercises,
    (result: any, value) => {
      const key = value.exerciseUid as string;
      if (result[key]) {
        result[key].push(value);
      } else {
        result[key] = [value];
      }
      return result;
    },
    {},
  );
}

export function recalcAverage(avg: number, n: number, val: number) {
  return (avg * (n - 1)) / n + val / n;
}

export const handleAnalyticsFetched =
  (data?: WorkoutExerciseProps[], athlete?: boolean) =>
  async (dispatch: AppDispatch, getState: () => ReducerProps) => {
    if (data) {
      if (data.length < 1) return [];

      const exercisesObj = reduceExercises(data);

      let analyticsArr: AnalyticsProps[] = [];

      for (var key in exercisesObj) {
        if (exercisesObj.hasOwnProperty(key)) {
          let exercises = exercisesObj[key];
          analyticsArr.push({
            exerciseUid: key,
            analytics: calcAnalytics(exercises),
            data: exercises.map(exercise => {
              return {
                workoutExerciseUid: exercise._id ? exercise._id : '',
                date: exercise.date as string,
                data: exercise.data,
              };
            }),
          });
        }
      }

      if (analyticsArr.length > 0) {
        //populate exercise data
        analyticsArr = await updateAnalyticsExercises(analyticsArr, athlete)(
          dispatch,
          getState,
        );
      }

      if (analyticsArr.length > 0) {
        if (athlete) {
          dispatch({ type: SET_ATHLETE_ANALYTICS, payload: analyticsArr });
        } else {
          dispatch({ type: UPDATE_ANALYTICS, payload: analyticsArr });
        }
      }

      return analyticsArr;
    }
  };
