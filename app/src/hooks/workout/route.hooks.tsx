import { useEffect, useLayoutEffect, useState } from 'react';
import { AnimatedRegion, LatLng } from 'react-native-maps';
import { HealthDataProps } from '../../services/workout/types';
import { MarkerProps } from '../../types/route/route.types';
import { moderateScale } from '../../components/tools/StyleConstants';
import { useNavigation, useRoute } from '@react-navigation/native';
import {
  HomeStackScreens,
  MyRouteProps,
  NavigationProps,
} from 'src/screens/home/types';
import WorkoutTracker from '../../classes/WorkoutTracker';
import { getWoRouteSamples } from 'src/helpers/health.helpers';

export const useRouteMarkers = () => {
  const route = useRoute<MyRouteProps>();
  const navigation = useNavigation<NavigationProps>();
  const [workoutTracker, setWorkoutTracker] = useState(new WorkoutTracker());

  const redirectToScreen = (screen: HomeStackScreens) => () =>
    navigation.push(screen, { data: route.params.data });

  useEffect(() => {
    if (!route.params || !route.params.data) {
      navigation.goBack();
      return;
    }

    const workoutHandler = async () => {
      const { data } = route.params as { data: HealthDataProps };
      const tracker = new WorkoutTracker();
      tracker.initializeHealthData(data);
      try {
        const routeSamples = await getWoRouteSamples(data.activityId);
        tracker.initializeLocations(routeSamples.data.locations);
      } catch (err) {
        console.log(err);
      }
      setWorkoutTracker(tracker);
    };

    workoutHandler().catch(err => console.log(err));
  }, [route]);

  return {
    redirectToScreen,
    workoutTracker,
  };
};

export const useMapAdjustView = (mapRef: any, polyCords: LatLng[]) => {
  useLayoutEffect(() => {
    //mount zoom into the coordinates
    if (mapRef.current && polyCords.length > 0) {
      mapRef.current.fitToCoordinates(polyCords, {
        edgePadding: {
          top: moderateScale(20),
          right: moderateScale(20),
          bottom: moderateScale(50),
          left: moderateScale(20),
        },
      });
    }
  }, [mapRef, polyCords]);
};

export function zoomToMarker(region: AnimatedRegion, markers: MarkerProps[]) {
  const [activeMarkIndex, setActiveMarkIndex] = useState<number>();

  useEffect(() => {
    if (activeMarkIndex != null) {
      if (markers[activeMarkIndex]) {
        const { coords } = markers[activeMarkIndex];
        region
          .timing({
            latitudeDelta: 0.002,
            longitudeDelta: 0.001,
            longitude: coords.longitude,
            latitude: coords.latitude,
            duration: 500,
          })
          .start();
      }
    }
  }, [activeMarkIndex]);

  return {
    activeMarkIndex,
    setActiveMarkIndex,
  };
}
