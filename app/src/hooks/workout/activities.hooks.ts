import { useCallback, useEffect, useState } from 'react';
import { getWoSample } from '../../helpers/health.helpers';
import { HealthDataProps } from '../../services/workout/types';
import AppleHealthKit from 'react-native-health';

export function useDeviceWos() {
  const d = new Date();
  const [fetchStartDate, setFetchStartDate] = useState(
    new Date(d.getFullYear(), d.getMonth() - 1, d.getDate(), 0),
  );
  const [deviceWos, setDeviceWos] = useState<HealthDataProps[]>([]);
  const [isFetching, setIsFetching] = useState(true);
  const [stopFetching, setStopFetching] = useState(false);

  const getDeviceActivities = useCallback(async () => {
    const d = new Date();

    const options = {
      startDate: fetchStartDate.toISOString(),
      endDate: d.toISOString(),
      type: AppleHealthKit.Constants.Observers.Workout,
    };

    let data: HealthDataProps[] = [];

    data = await getWoSample(options);

    data = data.filter(d => {
      if (
        d.activityName ===
        AppleHealthKit.Constants.Activities.TraditionalStrengthTraining
      )
        return false;
      return true;
    });

    setDeviceWos(wos => {
      // no extra wos were found
      if (data.length === wos.length) {
        setStopFetching(true);
        return wos;
      }
      return data.reverse();
    });
  }, [fetchStartDate]);

  useEffect(() => {
    (async () => {
      setIsFetching(true);
      await getDeviceActivities().catch(err => console.log(err));
      setIsFetching(false);
    })();
  }, [fetchStartDate]);

  return { deviceWos, isFetching, setFetchStartDate, stopFetching };
}
