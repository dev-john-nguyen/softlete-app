import { Alert } from 'react-native';
import { getPreciseDistance } from 'geolib';
import { LocationValue, WorkoutRouteQueryResults } from 'react-native-health';
import {
  HealthDataProps,
  WorkoutActionProps,
  WorkoutHeaderProps,
  WorkoutStatus,
} from '../services/workout/types';
import DateTools from '../utils/DateTools';
import { getWoRouteSamples } from './health.helpers';
import request from '../services/utils/request';
import PATHS from '../utils/PATHS';

interface ImportActionsProps {
  updateWorkoutHeader?: WorkoutActionProps['updateWorkoutHeader'];
  updateWoWorkoutRoute: WorkoutActionProps['updateWoWorkoutRoute'];
  updateWoHealthData: WorkoutActionProps['updateWoHealthData'];
}

async function validateSkipRouteSamples() {
  return new Promise((resolve, reject) => {
    Alert.alert(
      'No Route Found',
      "Activity doesn't have any route information in Health. Do you still want to import?",
      [
        {
          text: 'Maybe Later',
          onPress: () => reject(),
          style: 'cancel',
        },
        { text: 'Import', onPress: () => resolve('') },
      ],
    );
  });
}

export async function handleDeviceActivityImport(
  activity: HealthDataProps,
  {
    updateWoWorkoutRoute,
    updateWoHealthData,
    updateWorkoutHeader,
  }: ImportActionsProps,
  workoutUidParam?: string,
) {
  let routeSamples: WorkoutRouteQueryResults | undefined;

  try {
    routeSamples = await getWoRouteSamples(activity.activityId);
  } catch (err) {
    console.log(err);
    await validateSkipRouteSamples();
  }

  let locationStore: LocationValue[] = [];

  if (routeSamples) {
    locationStore = filterRouteLocations(routeSamples.data.locations);
  }

  let workoutUid = workoutUidParam;

  if (!workoutUid) {
    //need to convert date to a mm/dd/yyy
    const dateStr = DateTools.dateToStr(new Date(activity.date));
    const woHeader: WorkoutHeaderProps = {
      name: activity.activityName,
      date: dateStr,
      type: activity.activityName,
      isPrivate: false,
      description: '',
      status: WorkoutStatus.completed,
    };
    if (!updateWorkoutHeader) throw 'update workout header function required';
    const newWo = await updateWorkoutHeader(woHeader).then(res =>
      res ? res[0] : undefined,
    );

    if (!newWo || !newWo._id) throw 'failed to create workout';
    workoutUid = newWo._id;
  }

  //store health data
  //store workout route data
  await Promise.all([
    updateWoHealthData(workoutUid, activity),
    updateWoWorkoutRoute(workoutUid, locationStore, activity.activityId),
  ]);
}

export function filterRouteLocations(locations: LocationValue[]) {
  if (locations.length <= 20) return locations;

  let distance = 0;

  const store: LocationValue[] = [];
  let startMileIndex = 0;

  for (let i = 1; i < locations.length; i++) {
    //track distance
    const prevLoc = locations[i - 1];
    const curLoc = locations[i];

    const dis = getPreciseDistance(
      {
        latitude: prevLoc.latitude,
        longitude: prevLoc.longitude,
      },
      {
        latitude: curLoc.latitude,
        longitude: curLoc.longitude,
      },
    );

    distance += dis;

    //if distance is a mile grab 10 locations
    //how do I evenly grab 10 locations

    if (distance >= 1603.34) {
      const indexDiff = i - startMileIndex;
      const increment = Math.floor(indexDiff / 10);
      for (let j = startMileIndex; j < i; j = j + increment) {
        store.push(locations[j]);
      }
      distance = 0;
      startMileIndex = i;
    }
  }

  return store;
}

// this might be used for the future to fetch another athletes workout
export async function fetchWorkoutRouteLocations(
  userUid: string,
  activityId?: string,
  workoutUid?: string,
) {
  return request(
    'GET',
    PATHS.workouts.getWorkoutRoute(userUid, activityId, workoutUid),
    (() => null) as any,
  )
    .then(({ data }) => {
      if (!data || !data.locations) return [];
      return data.locations.map(({ latitude, longitude }: any) => ({
        latitude,
        longitude,
      }));
    })
    .catch(err => console.log(err));
}
