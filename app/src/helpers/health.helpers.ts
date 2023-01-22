import _ from 'lodash';
import AppleHealthKit, {
  HealthInputOptions,
  HealthValue,
  AnchoredQueryResults,
  HealthActivity,
  WorkoutRouteQueryResults,
} from 'react-native-health';
import { convertMsToTime } from '../utils/format';
import { DateValueProps, HealthDataProps } from '../services/workout/types';

export enum SleepValueProps {
  CORE = 'CORE',
  DEEP = 'DEEP',
  AWAKE = 'AWAKE',
  REM = 'REM',
  // older version
  INBED = 'INBED',
  ASLEEP = 'ASLEEP',
}

export type SleepSamples = {
  id: string;
  endDate: string;
  sourceId: string;
  sourceName: string;
  startDate: string;
  value: SleepValueProps;
};

export const getHeartRateSample = async (
  startDate: string,
  endDate: string,
) => {
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
      (err, results: Array<HealthValue>) => {
        if (err) {
          return reject(err);
        }
        resolve(results);
      },
    );
  }) as Promise<HealthValue[]>;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getWoSample = async (options: any) => {
  return new Promise((resolve, reject) => {
    AppleHealthKit.getAnchoredWorkouts(
      options,
      async (err, results: AnchoredQueryResults) => {
        if (err) {
          return reject(err);
        }

        const samples: HealthDataProps[] = [];

        if (results.data) {
          for (let i = 0; i < results.data.length; i++) {
            const d = results.data[i];
            const heartRates = await getHeartRateSample(d.start, d.end).then(
              hrs => hrs.map(hr => hr.value),
            );
            samples.push({
              activityId: d.id,
              activityName: d.activityName as HealthActivity,
              calories: d.calories,
              sourceName: d.sourceName,
              duration: d.duration,
              distance: d.distance,
              start: d.start,
              end: d.end,
              date: d.start,
              heartRates: heartRates,
              workoutEvents: d.workoutEvents,
            });
          }
        }
        resolve(samples);
      },
    );
  }) as Promise<HealthDataProps[]>;
};

export const getHRSamples = async (startDate: Date, endDate: Date) => {
  return new Promise((resolve, reject) => {
    //get hrv past month
    const options: HealthInputOptions = {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      ascending: true,
    };
    AppleHealthKit.getHeartRateVariabilitySamples(options, (err, results) => {
      if (err) {
        reject(err);
      }

      resolve(results);
    });
  }) as Promise<HealthValue[]>;
};

export const getRRSamples = async (startDate: Date, endDate: Date) => {
  return new Promise((resolve, reject) => {
    //get hrv past month
    const options: HealthInputOptions = {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      ascending: true,
    };
    AppleHealthKit.getRespiratoryRateSamples(options, (err, results) => {
      if (err) {
        reject(err);
      }
      resolve(results);
    });
  }) as Promise<HealthValue[]>;
};

export const getSleepSamples = async (startDate: Date, endDate: Date) => {
  return new Promise((resolve, reject) => {
    //get hrv past month
    const options: HealthInputOptions = {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      ascending: true,
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    AppleHealthKit.getSleepSamples(options, (err, results: any) => {
      if (err) {
        reject(err);
      }
      resolve(results);
    });
  }) as Promise<SleepSamples[]>;
};

// method needs to be updated since sleep samples have updated it's values
export const filerSleepSamples = async (startDate: Date, endDate: Date) => {
  try {
    const s = await getSleepSamples(startDate, endDate);
    //get average sleep the night of
    const samples = s
      .reverse()
      .filter(sple => sple.value === SleepValueProps.INBED);
    //samples should be sorted in ascending order
    const sleepStore: DateValueProps[] = [];

    let totalSleep = 0;
    let sleepDate: Date | undefined;

    for (let i = 0; i < samples.length; i++) {
      const sample = samples[i];
      const diff =
        new Date(sample.endDate).getTime() -
        new Date(sample.startDate).getTime();

      if (i === 0) {
        totalSleep += diff;
        sleepDate = new Date(sample.endDate);
        continue;
      }

      //check if it's a new sleep cycle
      const sampleB4 = samples[i - 1];

      const diffSamples =
        new Date(sampleB4.startDate).getTime() -
        new Date(sample.endDate).getTime();

      if (diffSamples > 3600000 * 6) {
        //greater than 6 hours assume new sleep cycle
        const time = convertMsToTime(totalSleep) as string;
        const sleepAmt = parseFloat(time.split(' ')[0]);
        sleepStore.push({
          value: sleepAmt ? sleepAmt : 0,
          date: sleepDate ? sleepDate : new Date(),
        });

        totalSleep = 0;
        sleepDate = new Date(sample.endDate);
      }

      totalSleep += diff;
    }

    return sleepStore.reverse();
  } catch (err) {
    console.log(err);
  }
};

export const getWoRouteSamples = async (id: string) => {
  return new Promise((resolve, reject) => {
    AppleHealthKit.getWorkoutRouteSamples({ id }, (err, results) => {
      if (err) {
        reject(err);
      }
      resolve(results);
    });
  }) as Promise<WorkoutRouteQueryResults>;
};

export const getRestingHeartRateSamples = (startDate: Date, endDate: Date) => {
  return new Promise((resolve, reject) => {
    //get hrv past month
    const options: HealthInputOptions = {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      ascending: true,
    };
    AppleHealthKit.getRestingHeartRateSamples(options, (err, results) => {
      if (err) {
        reject(err);
      }
      resolve(results);
    });
  }) as Promise<HealthValue[]>;
};

export const getSleepDailyAmts = async (startDate: Date, endDate: Date) => {
  const s = await getSleepSamples(startDate, endDate);
  //get average sleep the night of
  const samples = s
    .reverse()
    .filter(
      sple =>
        sple.value === SleepValueProps.CORE ||
        sple.value === SleepValueProps.DEEP ||
        sple.value === SleepValueProps.REM ||
        sple.value === SleepValueProps.ASLEEP,
    );
  //samples should be sorted in ascending order
  const sleepStore: DateValueProps[] = [];

  let totalSleep = 0;
  let sleepDate: Date | undefined;

  for (let i = 0; i < samples.length; i++) {
    const sample = samples[i];
    const diff =
      new Date(sample.endDate).getTime() - new Date(sample.startDate).getTime();

    if (i === 0) {
      totalSleep += diff;
      sleepDate = new Date(sample.endDate);
      continue;
    }

    //check if it's a new sleep cycle
    const sampleB4 = samples[i - 1];

    const diffSamples =
      new Date(sampleB4.startDate).getTime() -
      new Date(sample.endDate).getTime();

    if (diffSamples > 3600000 * 6) {
      //greater than 6 hours assume new sleep cycle
      const time = convertMsToTime(totalSleep) as string;
      const sleepAmt = parseFloat(time.split(' ')[0]);
      sleepStore.push({
        value: sleepAmt ? sleepAmt : 0,
        date: sleepDate ? sleepDate : new Date(),
      });

      totalSleep = 0;
      sleepDate = new Date(sample.endDate);
    }

    totalSleep += diff;
  }
  return sleepStore;
};
