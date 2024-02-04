import { LocationValue, WorkoutRouteQueryResults } from 'react-native-health';
import { useDispatch } from 'react-redux';
import { getWoRouteSamples } from 'src/helpers/health.helpers';
import {
  filterRouteLocations,
  validateSkipRouteSamples,
} from 'src/helpers/route.helpers';
import { ThunkAppDispatch } from 'src/services';
import {
  updateWoHealthData,
  updateWoWorkoutRoute,
} from 'src/services/workout/actions';
import { HealthDataProps } from 'src/services/workout/types';

// Refactored version of handleDeviceActivityImport in route.helpers.ts

export const useImportDeviceActivities = () => {
  const dispatch = useDispatch<ThunkAppDispatch>();

  const importDeviceActivity = async (
    activity: HealthDataProps,
    workoutUid: string,
  ) => {
    let routeSamples: WorkoutRouteQueryResults | undefined;

    if (activity.sourceName !== 'Manual') {
      try {
        routeSamples = await getWoRouteSamples(activity.activityId);
      } catch (err) {
        console.log(err);
        await validateSkipRouteSamples();
      }
    }

    let locationStore: LocationValue[] = [];

    if (routeSamples) {
      locationStore = filterRouteLocations(routeSamples.data.locations);
    }

    //store health data
    //store workout route data
    await Promise.all([
      dispatch(updateWoHealthData(workoutUid as string, activity)),
      dispatch(
        updateWoWorkoutRoute(
          workoutUid as string,
          locationStore,
          activity.activityId,
        ),
      ),
    ]);
  };

  return { importDeviceActivity };
};
