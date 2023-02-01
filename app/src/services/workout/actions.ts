import { AppDispatch } from '../../../App';
import { ReducerProps } from '..';
import {
  WorkoutExerciseProps,
  WorkoutProps,
  WorkoutStatus,
  DataArrProps,
  WorkoutHeaderProps,
  HealthDataProps,
  WorkoutRouteProps,
} from './types';
import { setBanner } from '../banner/actions';
import {
  UPDATE_WORKOUTS,
  SET_SELECTED_DATE_WORKOUTS,
  REMOVE_WORKOUTS,
  SET_VIEW_WORKOUT,
  UPDATE_WORKOUT_INFO,
  UPDATE_WORKOUT_EXERCISES,
  INSERT_WORKOUT_FETCHED_MONTH,
  SET_HEALTH_DATA,
  INSERT_HEALTH_DATA,
} from './actionTypes';
import request from '../utils/request';
import PATHS from '../../utils/PATHS';
import { ProgramWorkoutProps } from '../program/types';
import { isInvalidExerciseData, prepareExercisesForRequest } from './utils';
import {
  insertExercisesIntoWorkouts,
  insertExercises,
} from '../exercises/actions';
import _ from 'lodash';
import { processAnalyticsExercises } from '../misc/actions';
import {
  MeasSubCats,
  MeasCats,
  Categories,
  MuscleGroups,
  Equipments,
} from '../exercises/types';
import DateTools from '../../utils/DateTools';
import { BannerTypes } from '../banner/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LocalStoragePaths from '../../utils/LocalStoragePaths';
import AutoId from '../../utils/AutoId';
import processImage from '../utils/process-image';
import { ImageProps } from '../user/types';
import { prefetchWoImages } from '../utils/prefetch-images';
import removeImage from '../utils/remove-media';
import Limits from '../../utils/Limits';
import { LocationValue } from 'react-native-health';

export const updateWorkoutHeader =
  (workoutHeader: WorkoutHeaderProps) =>
  async (dispatch: AppDispatch, getState: () => ReducerProps) => {
    let path;

    const { workout, global } = getState();

    const validateWo = () => {
      const { workouts } = workout;
      const newWoDate = DateTools.strToDate(workoutHeader.date);
      const wos = workouts.filter(w => {
        const d = new Date(w.date);
        return DateTools.isSameDate(d, newWoDate);
      });

      return wos.length < Limits.maxDailyWos;
    };

    if (global.offline) {
      let workoutStore;
      if (workoutHeader._id) {
        workoutStore = {
          ...workout.viewWorkout,
          ...workoutHeader,
        };
      } else {
        //new workout
        if (!validateWo()) {
          dispatch(
            setBanner(
              BannerTypes.warning,
              'You exceeded the daily limit of 5 workouts for this day.',
            ),
          );
          throw 'exceed daily limit';
        }

        workoutStore = {
          ...workoutHeader,
          status: WorkoutStatus.pending,
          _id: AutoId.newId(10),
        };
      }
      dispatch({ type: UPDATE_WORKOUTS, payload: [workoutStore] });
      dispatch({ type: SET_VIEW_WORKOUT, payload: workoutStore });
      return;
    }

    if (workoutHeader._id) {
      path = PATHS.workouts.updateHeader;
    } else {
      //new workout
      if (!validateWo()) {
        dispatch(
          setBanner(
            BannerTypes.warning,
            'You exceeded the daily limit of 5 workouts for this day.',
          ),
        );
        throw 'exceed daily limit';
      }

      path = PATHS.workouts.create;
    }

    return request('POST', path, dispatch, { workouts: [workoutHeader] }).then(
      ({ data }: { data?: WorkoutHeaderProps[] }) => {
        if (data) {
          if (workoutHeader._id) {
            const updatedWorkout = { ...workout.viewWorkout, ...data[0] };
            dispatch({ type: UPDATE_WORKOUTS, payload: [updatedWorkout] });
            dispatch({ type: SET_VIEW_WORKOUT, payload: updatedWorkout });
          } else {
            dispatch({ type: UPDATE_WORKOUTS, payload: data });
            dispatch({ type: SET_VIEW_WORKOUT, payload: data[0] });
          }
          return data;
        } else {
          throw 'Failed to insert or update workout header.';
        }
      },
    );
  };

export const updateWorkoutExercises =
  (
    workoutUid: string,
    exercises: WorkoutExerciseProps[],
    removedExercises?: WorkoutExerciseProps[],
  ) =>
  async (dispatch: AppDispatch, getState: () => ReducerProps) => {
    if (!workoutUid) return;

    const saveExercises = removedExercises
      ? [...exercises, ...removedExercises]
      : [...exercises];

    const { offline } = getState().global;

    if (offline) {
      dispatch({
        type: UPDATE_WORKOUT_EXERCISES,
        payload: {
          _id: workoutUid,
          exercises: _.uniqBy(saveExercises, '_id').map(e => ({
            ...e,
            tempId: AutoId.newId(20),
            workoutUid: workoutUid,
          })),
        },
      });
    } else {
      const saveData = {
        _id: workoutUid,
        exercises: prepareExercisesForRequest(saveExercises),
      };
      const { data: resData }: { data?: WorkoutExerciseProps[] } =
        await request(
          'POST',
          PATHS.workouts.updateExercises,
          dispatch,
          saveData,
        );
      if (!resData) return;
      const resDataExs = await insertExercises(resData)(dispatch, getState);
      dispatch({
        type: UPDATE_WORKOUT_EXERCISES,
        payload: {
          _id: workoutUid,
          exercises: removedExercises
            ? _.uniqBy([...resDataExs, ...removedExercises], '_id')
            : [...resDataExs],
        },
      });
    }
  };

export const removeWorkoutExercise =
  async (exercise: WorkoutExerciseProps) =>
  async (dispatch: AppDispatch, getState: () => ReducerProps) => {
    //need to add remove to exercise
    //just create a new route specifically for removing one exercise
    //check if offline
    const { offline } = getState().global;

    if (offline) {
      if (exercise._id || exercise.tempId) {
        dispatch({
          type: UPDATE_WORKOUT_EXERCISES,
          payload: {
            _id: exercise.workoutUid,
            exercises: [{ ...exercise, remove: true }],
          },
        });
      }
      return;
    }

    return request('POST', PATHS.workouts.removeExercise, dispatch, {
      exerciseUid: exercise._id,
    })
      .then(({ data }: { data?: WorkoutExerciseProps }) => {
        if (data) {
          //update remove to true
          data.remove = true;
          dispatch({
            type: UPDATE_WORKOUT_EXERCISES,
            payload: {
              _id: data.workoutUid,
              exercises: [data],
            },
          });
        }
      })
      .catch(err => console.log(err));
  };

export const fetchWorkouts =
  (fromDate: string, toDate: string) =>
  async (dispatch: AppDispatch, getState: () => ReducerProps) => {
    const { user, workout, global } = getState();
    //can determine if a month was already fetched just store months
    const toFetchDate = DateTools.strToDate(fromDate);

    if (!toFetchDate) return;

    const toFetchMonth = toFetchDate.getMonth();
    const fetched = workout.fetchedMonths.find(m => m === toFetchMonth);

    //this month was already fetched
    if (fetched) {
      dispatch({ type: UPDATE_WORKOUTS, payload: [] });
      dispatch({ type: SET_SELECTED_DATE_WORKOUTS });
      return;
    }

    if (global.offline) {
      const offlineWosStr = await AsyncStorage.getItem(
        LocalStoragePaths.offlineWos,
      );
      if (offlineWosStr) {
        const offlineWos: WorkoutProps[] = JSON.parse(offlineWosStr);
        const workouts = await insertExercisesIntoWorkouts(offlineWos)(
          dispatch,
          getState,
        );
        dispatch({ type: UPDATE_WORKOUTS, payload: workouts });
        dispatch({ type: SET_SELECTED_DATE_WORKOUTS });
      }
      return;
    }

    const { data }: { data?: WorkoutProps[] } = await request(
      'GET',
      PATHS.workouts.fetch(fromDate, toDate, user.uid),
      dispatch,
    ).catch(() => {
      return {};
    });

    if (data) {
      if (data.length < 1) {
        dispatch({ type: UPDATE_WORKOUTS, payload: data });
        dispatch({ type: SET_SELECTED_DATE_WORKOUTS });
      } else {
        prefetchWoImages(data);
        const workouts = await insertExercisesIntoWorkouts(data)(
          dispatch,
          getState,
        );
        dispatch({ type: UPDATE_WORKOUTS, payload: workouts });
        dispatch({ type: SET_SELECTED_DATE_WORKOUTS });
      }

      dispatch({
        type: INSERT_WORKOUT_FETCHED_MONTH,
        payload: toFetchDate.getMonth(),
      });
    }
  };

export const removeWorkout =
  (workoutUid: string) =>
  async (dispatch: AppDispatch, getState: () => ReducerProps) => {
    const { global, workout } = getState();

    if (!global.offline) {
      const wo = workout.workouts.find(w => w._id === workoutUid);
      if (wo) removeImage([wo.imageUri]);

      request('POST', PATHS.workouts.remove, dispatch, {
        workoutUids: [workoutUid],
      })
        .then(({ data }) => {
          if (data) console.log('removed');
        })
        .catch(err => {
          console.log(err);
        });
    }

    dispatch({ type: REMOVE_WORKOUTS, payload: [workoutUid] });
  };

export const duplicateWorkout =
  (date: string) =>
  async (dispatch: AppDispatch, getState: () => ReducerProps) => {
    const { workout, global } = getState();

    if (!workout.copiedWorkout || !date) return; //empty

    if (global.offline) {
      const dupWorkout = workout.workouts.find(
        wo => wo._id === workout.copiedWorkout,
      );
      if (dupWorkout) {
        const newId = AutoId.newId(10);
        const newWorkout: WorkoutProps = {
          ...dupWorkout,
          _id: newId,
          date: date,
          status: WorkoutStatus.pending,
          imageBase64: '',
          imageUri: '',
          reflection: '',
          strainRating: 0,
          likeUids: [],
          exercises: dupWorkout.exercises.map(e => {
            const { _id, workoutUid, ...rest } = e;
            return {
              ...rest,
              workoutUid: newId,
              tempId: AutoId.newId(10),
              data: e.data.map((d: any) => {
                //need to remove perform values and _id
                const { _id, performVal, completed, ...restD } = d;
                return {
                  ...restD,
                };
              }),
            };
          }),
        };
        dispatch({ type: UPDATE_WORKOUTS, payload: [newWorkout] });
        dispatch(setBanner(BannerTypes.default, 'Pasted!'));
      }
      return;
    }

    const { data }: { data?: WorkoutProps } = await request(
      'POST',
      PATHS.workouts.duplicate,
      dispatch,
      { workoutUid: workout.copiedWorkout, date },
    );

    if (data) {
      //data will be the copied workout
      const workouts = await insertExercisesIntoWorkouts([data])(
        dispatch,
        getState,
      ).catch(err => console.log(err));
      dispatch({
        type: UPDATE_WORKOUTS,
        payload: workouts ? workouts : [data],
      });
      dispatch(setBanner(BannerTypes.default, 'Pasted!'));
    }
  };

export const setViewWorkout =
  (workoutUid: string, isProgram?: boolean) =>
  async (dispatch: AppDispatch, getState: () => ReducerProps) => {
    const { workout, program } = getState();

    let viewWorkout: WorkoutProps | ProgramWorkoutProps | undefined;

    if (isProgram) {
      const { programs } = program;

      for (let i = 0; i < programs.length; i++) {
        const { workouts } = programs[i];
        if (workouts) {
          viewWorkout = workouts.find(w => w._id === workoutUid);
          if (viewWorkout) break;
        }
      }
    } else {
      viewWorkout = workout.workouts.find(w => w._id === workoutUid);
    }

    if (viewWorkout && viewWorkout.exercises) {
      //clone
      const clonedWorkout = _.cloneDeep(viewWorkout);
      //insert exercises
      clonedWorkout.exercises = await insertExercises(clonedWorkout.exercises)(
        dispatch,
        getState,
      );
      //all the exercises that weren't inserted, insert placeholder
      clonedWorkout.exercises = clonedWorkout.exercises.map(e => {
        if (!e.exercise) {
          e.exercise = {
            _id: Math.random().toString(),
            description: '',
            name: 'not found',
            measSubCat: MeasSubCats.lb,
            measCat: MeasCats.weight,
            category: Categories.other,
            muscleGroup: MuscleGroups.other,
            equipment: Equipments.none,
          };
        }
        return {
          ...e,
          data: e.data.map(d => ({
            ...d,
            pct: d.pct ? d.pct : 100,
            predictVal: d.predictVal ? d.predictVal : 0,
            reps: d.reps ? d.reps : 1,
          })),
        };
      });

      dispatch({
        type: SET_VIEW_WORKOUT,
        payload: clonedWorkout,
      });
    } else {
      dispatch({
        type: SET_VIEW_WORKOUT,
        payload: viewWorkout,
      });
    }
  };

export const updateWorkoutStatus =
  async (workoutUid: string, status: WorkoutStatus, online?: boolean) =>
  async (dispatch: AppDispatch, getState: () => ReducerProps) => {
    const { offline } = getState().global;

    if (!offline && !online) {
      const { data } = await request(
        'POST',
        PATHS.workouts.updateStatus,
        dispatch,
        { _id: workoutUid, status },
      );
      if (!data) return;
    }

    dispatch({
      type: UPDATE_WORKOUT_INFO,
      payload: {
        workoutUid,
        updatedData: { status },
      },
    });
  };

export const updateWorkoutExerciseData =
  async (dataArr: DataArrProps[]) =>
  async (dispatch: AppDispatch, getState: () => ReducerProps) => {
    //validate data

    const { global, workout } = getState();
    const { exercises, _id } = workout.viewWorkout;
    const { offline } = global;

    for (let i = 0; i < dataArr.length; i++) {
      const { data, _id, tempId } = dataArr[i];

      if ((!_id && !offline) || (offline && !tempId && !_id)) return;

      const isInvalid = isInvalidExerciseData(data);

      if (isInvalid) {
        dispatch(setBanner(BannerTypes.error, isInvalid));
        return;
      }
    }
    //update the exercises
    const updatedExercises: WorkoutExerciseProps[] = exercises.map(e => {
      const targetE = dataArr.find(
        d => (d._id && d._id === e._id) || (d.tempId && d.tempId === e.tempId),
      );
      if (targetE) {
        e.data = targetE.data;
        e.calcRef = targetE.calcRef;
      }
      return { ...e };
    });

    if (!offline) {
      const res = await request('POST', PATHS.workouts.updateData, dispatch, {
        dataArr,
      }).catch(err => {
        console.log(err);
      });
      if (!res || !res.data) return;
    }

    dispatch({
      type: UPDATE_WORKOUT_INFO,
      payload: {
        workoutUid: _id,
        updatedData: {
          exercises: updatedExercises,
        },
      },
    });

    return updatedExercises;
  };

export const completeWorkout =
  async (
    workout: WorkoutProps,
    strainRating: number,
    reflection: string,
    image?: ImageProps,
    online?: boolean,
  ) =>
  async (dispatch: AppDispatch, getState: () => ReducerProps) => {
    const { global } = getState();

    if (global.offline && !online) {
      dispatch({
        type: UPDATE_WORKOUT_INFO,
        payload: {
          workoutUid: workout._id,
          updatedData: {
            status: WorkoutStatus.completed,
            strainRating,
            reflection,
            imageBase64: image ? image.base64 : '',
            localImageUri: image
              ? image.uri
              : workout.imageUri
              ? workout.imageUri
              : '',
          },
        },
      });
      return;
    }

    let imageId = workout.imageId;
    let localImageUri = workout.localImageUri;

    if (image && image.base64) {
      //new image, so generate a new image Id
      imageId = AutoId.newId(10);
      localImageUri = image.uri;
      processImage(image.base64, imageId)(dispatch, getState);
    }

    const { data }: { data?: WorkoutProps } = await request(
      'POST',
      PATHS.workouts.complete,
      dispatch,
      {
        _id: workout._id,
        status: WorkoutStatus.completed,
        strainRating,
        reflection,
        imageId,
        localImageUri,
      },
    );

    if (data) {
      //update analytics
      processAnalyticsExercises(workout)(dispatch, getState);

      dispatch({
        type: UPDATE_WORKOUT_INFO,
        payload: {
          workoutUid: data._id,
          updatedData: {
            status: data.status,
            strainRating: data.strainRating,
            reflection: data.reflection,
            imageUri: data.imageUri,
            localImageUri: data.localImageUri,
          } as WorkoutProps,
        },
      });
    }
  };

export const updateWoHealthData =
  async (workoutUid: string, healthData: HealthDataProps) =>
  async (dispatch: AppDispatch, getState: () => ReducerProps) => {
    const { global } = getState();
    let duration = healthData.duration;

    if (!duration && healthData.start && healthData.end) {
      duration =
        new Date(healthData.end).getTime() -
        new Date(healthData.start).getTime();
    }

    const healthObj: HealthDataProps = {
      workoutUid: workoutUid,
      activityId: healthData.activityId,
      activityName: healthData.activityName,
      sourceName: healthData.sourceName,
      duration: duration,
      calories: healthData.calories,
      distance: healthData.distance,
      heartRates: healthData.heartRates,
      disMeas: healthData.disMeas,
      date: healthData.date,
      workoutEvents: healthData?.workoutEvents || [],
    };

    if (!global.offline) {
      request('POST', PATHS.workouts.updateHealthData, dispatch, healthObj)
        .then(({ data }: { data?: any }) => {
          if (data) {
            dispatch({
              type: UPDATE_WORKOUT_INFO,
              payload: {
                workoutUid: workoutUid,
                updatedData: { healthData: data },
              },
            });

            dispatch({ type: INSERT_HEALTH_DATA, payload: data });
          }
        })
        .catch(err => console.log(err));
    }

    dispatch({
      type: UPDATE_WORKOUT_INFO,
      payload: {
        workoutUid: workoutUid,
        updatedData: { healthData: healthObj },
      },
    });
  };

export const updateWoWorkoutRoute =
  async (workoutUid: string, locations: LocationValue[], activityId?: string) =>
  async (dispatch: AppDispatch, getState: () => ReducerProps) => {
    const { global } = getState();

    if (locations.length < 1) return;

    if (global.offline) {
      dispatch(
        setBanner(
          BannerTypes.warning,
          'You are offline. Cannot save workout routes',
        ),
      );
      return;
    }

    return request('POST', PATHS.workouts.updateWorkoutRoute, dispatch, {
      workoutUid,
      locations,
      activityId,
    })
      .then(({ data }: { data?: WorkoutRouteProps }) => {
        //need to dispatch
        return data;
      })
      .catch(err => {
        console.log(err);
      });
  };

export const getAllHealthData =
  () => async (dispatch: AppDispatch, getState: () => ReducerProps) => {
    const { user } = getState();

    request('GET', PATHS.workouts.getAllHealthData(user.uid), dispatch)
      .then(({ data }: { data?: HealthDataProps[] }) => {
        if (data) {
          dispatch({ type: SET_HEALTH_DATA, payload: data });
        }
      })
      .catch(err => console.log(err));
  };
