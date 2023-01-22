import AppleHealthKit from 'react-native-health';
import _ from 'lodash';
import DateTools from './DateTools';

export const renderHealthActivityName = (type: string) => {
  if (!type) return '';
  switch (type) {
    case AppleHealthKit.Constants.Activities.TraditionalStrengthTraining:
      return 'Strength Training';
    case AppleHealthKit.Constants.Activities.Cycling:
      return AppleHealthKit.Constants.Activities.Cycling;
    case AppleHealthKit.Constants.Activities.Swimming:
      return AppleHealthKit.Constants.Activities.Swimming;
    case AppleHealthKit.Constants.Activities.Stairs:
    case AppleHealthKit.Constants.Activities.StairClimbing:
      return 'Stairs';
    case AppleHealthKit.Constants.Activities.Yoga:
      return AppleHealthKit.Constants.Activities.Yoga;
    case AppleHealthKit.Constants.Activities.Walking:
      return AppleHealthKit.Constants.Activities.Walking;
    case AppleHealthKit.Constants.Activities.Hiking:
      return AppleHealthKit.Constants.Activities.Hiking;
    case AppleHealthKit.Constants.Activities.Running:
      return AppleHealthKit.Constants.Activities.Running;
    default:
      return 'Activity';
  }
};

export const renderTime = (date: string) => {
  const d = new Date(date);
  if (!d) return;
  return d.getHours() + ':' + d.getMinutes();
};

export const renderDate = (date: string) => {
  const d = new Date(date);
  return DateTools.strToMMDD(DateTools.dateToStr(d));
};

export const renderCalories = (cal: number) => Math.round(cal) + ' kcal';

export const renderDistance = (distance: number) =>
  Math.round(distance * 100) / 100;

export const renderHeartRateAvg = (heartRates?: number[]) => {
  if (heartRates && heartRates.length > 0) {
    const mean = _.mean(heartRates);
    return _.floor(mean);
  }
  return 0;
};

export const convertMsToTime = (msec: number, output?: 'string' | 'minute') => {
  if (output === 'minute') return msec / 60000;

  const hh = Math.floor(msec / 1000 / 60 / 60);
  msec -= hh * 1000 * 60 * 60;
  const mm = Math.floor(msec / 1000 / 60);
  msec -= mm * 1000 * 60;
  const ss = Math.floor(msec / 1000);
  msec -= ss * 1000;

  if (hh > 0) {
    return hh + '.' + mm + ' hrs';
  } else if (mm > 0) {
    return mm + ':' + ss + ' mins';
  } else {
    return ss + ' secs';
  }
};

export function calculatePace(totalTime: number, distance: number) {
  if (!totalTime || !distance) return '0:00';
  // Calculate the pace in seconds per mile
  const paceInSeconds = totalTime / distance;

  // Calculate the number of minutes and seconds
  const minutes = Math.floor(paceInSeconds / 60);
  const seconds = Math.round(paceInSeconds % 60);

  // Return the pace in the format of minutes:seconds
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}
