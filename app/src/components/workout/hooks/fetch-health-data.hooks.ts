import { useWorkoutState } from '@app/contexts';
import { useEffect, useRef, useState } from 'react';
import { getWoSample } from 'src/helpers/health.helpers';
import { HealthDataProps, WorkoutProps } from 'src/services/workout/types';
import AppleHealthKit, {
  HealthInputOptions,
  HealthValue,
  HealthObserver,
} from 'react-native-health';
import _ from 'lodash';

export const useFetchHealthData = (
  workoutProp?: WorkoutProps,
  type = AppleHealthKit.Constants.Observers.Workout,
) => {
  const { workout: workoutFromContext } = useWorkoutState();
  const workout = workoutProp ?? workoutFromContext;
  const [data, setData] = useState<HealthDataProps[]>([]);
  const mount = useRef(false);

  const getActiveEnergy = async () => {
    if (!workout.date) return;
    const d = new Date(workout.date);

    const options = {
      startDate: new Date(
        d.getFullYear(),
        d.getMonth(),
        d.getUTCDate(),
        0,
      ).toISOString(),
      endDate: new Date(
        d.getFullYear(),
        d.getMonth(),
        d.getUTCDate(),
        24,
      ).toISOString(),
      type,
    };

    try {
      const woSamples = await getWoSample(options);
      fetchHeartRateData(woSamples);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchHeartRateData = async (healthData: HealthDataProps[]) => {
    if (healthData.length < 1) return;

    const dataToFetchHR = healthData.filter(d => d.start && d.end);

    if (dataToFetchHR.length < 1) return;

    interface StoreProps {
      heartRates: number[];
      activityId: string;
    }

    const heartRateStore: StoreProps[] = [];

    for (let i = 0; i < dataToFetchHR.length; i++) {
      const item = dataToFetchHR[i];
      if (item.start && item.end) {
        try {
          const heartRates = await getHeartRateSample(item.start, item.end);
          heartRateStore.push({
            activityId: item.activityId,
            heartRates: heartRates.map(h => h.value),
          });
        } catch (err) {
          console.log(err);
        }
      }
    }

    if (heartRateStore.length > 0) {
      if (!mount.current) return;

      setData(d => {
        const h = healthData.map(i => {
          const heartRates = heartRateStore.find(
            h => h.activityId === i.activityId,
          );
          return {
            ...i,
            heartRates: heartRates ? heartRates.heartRates : undefined,
          };
        });
        return _.uniqBy([...h, ...d], 'activityId');
      });
    }
  };

  const getHeartRateSample = async (startDate: string, endDate: string) => {
    return new Promise((resolve, reject) => {
      const options = {
        unit: 'bpm',
        startDate: startDate,
        endDate: endDate,
        limit: 100,
        ascending: false,
      } as HealthInputOptions;

      AppleHealthKit.getHeartRateSamples(
        options,
        (err: any, results: Array<HealthValue>) => {
          if (err) {
            return reject(err);
          }
          resolve(results);
        },
      );
    }) as Promise<HealthValue[]>;
  };

  useEffect(() => {
    getActiveEnergy();
  }, [workout]);

  return { data };
};
