import { useCallback, useEffect, useMemo, useState } from 'react';
import { getWoSample } from '../../helpers/health.helpers';
import { HealthDataProps, WorkoutProps } from '../../services/workout/types';
import AppleHealthKit from 'react-native-health';
import DateTools from '../../utils/DateTools';

export function useActiveWos(workouts: WorkoutProps[]) {
  const [deviceWos, setDeviceWos] = useState<HealthDataProps[]>([]);
  const d = new Date();

  const searchDeviceActivities = useCallback(() => {
    const options = {
      startDate: new Date(
        d.getFullYear(),
        d.getMonth(),
        d.getDate(),
        0,
      ).toISOString(),
      endDate: new Date(
        d.getFullYear(),
        d.getMonth(),
        d.getDate(),
        24,
      ).toISOString(),
      type: AppleHealthKit.Constants.Observers.Workout,
    };
    getWoSample(options)
      .then(data => {
        //filter strength training
        const filterData = data.filter(
          d =>
            d.activityName !==
            AppleHealthKit.Constants.Activities.TraditionalStrengthTraining,
        );
        setDeviceWos(filterData);
      })
      .catch(err => console.log(err));
  }, []);

  const wos = useMemo(() => {
    const filterDate = new Date(d.getFullYear(), d.getMonth(), d.getDate());

    const filteredWo = workouts.filter(w => {
      const woD = DateTools.UTCISOToLocalDate(w.date);
      if (
        woD.getUTCFullYear() === filterDate.getUTCFullYear() &&
        woD.getUTCMonth() === filterDate.getUTCMonth() &&
        woD.getUTCDate() === filterDate.getUTCDate()
      )
        return true;
      return false;
    });

    return filteredWo;
  }, [workouts]);

  const unsyncedDeviceWos = useMemo(() => {
    return deviceWos.filter(
      data => !wos.find(wo => wo.healthData?.activityId === data.activityId),
    );
  }, [deviceWos, wos]);

  useEffect(() => {
    searchDeviceActivities();
  }, [workouts]);

  return {
    wos,
    deviceWos: unsyncedDeviceWos,
  };
}
