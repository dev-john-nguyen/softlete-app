import { SERVERURL } from './PATHS';

export { default as Colors } from './BaseColors';
export { default as Constants } from './Constants';
export { default as DateTools } from './DateTools';
export * from './tools';
export { default as StyleConstants } from '../components/tools/StyleConstants';
export * from '../components/tools/StyleConstants';
export * from './BaseColors';
export * from './hooks';
export { default as Fonts } from './Fonts';
export * from './format';
export { default as TimeConverter } from './TimeConverter';
export { default as AutoId } from './AutoId';
export * from '../services/utils/request';
export { default as PATHS } from './PATHS';
export { default as DemoExerciseData } from './demo/demo-exercise.json';
export { default as DemoWorkoutData } from './demo/demo-workout.json';
export * from './BottomTabBarHiddenScreens';

export function getURL(path: string) {
  return SERVERURL + path;
}
