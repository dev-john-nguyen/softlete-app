import {
  HealthActivity,
  HKWorkoutEventType,
  LocationValue,
} from 'react-native-health';
import { ExerciseProps } from '../exercises/types';
import { ProgramWorkoutProps } from '../program/types';
import { ImageProps } from '../user/types';
import AppleHealthKit from 'react-native-health';

export interface RootWorkoutProps {
  workoutHeader: EditWorkoutProps;
  copiedWorkout: WorkoutProps['_id'];
  workouts: WorkoutProps[];
  monthWorkouts: MonthWorkoutsProps;
  selectedDate: string;
  selectedDateWorkouts: WorkoutProps[];
  viewWorkout: ViewWorkoutProps;
  filterByProgramUid: string;
  fetchedMonths: number[];
  healthData: HealthDataProps[];
}

export interface ViewWorkoutProps extends WorkoutProps, ProgramWorkoutProps {}

export interface MonthWorkoutsProps {
  [date: string]: {
    dots: {
      key: string;
      color: string;
    }[];
  };
}

export interface WorkoutProps {
  _id: string;
  date: string;
  description: string;
  createdAt?: string;
  updatedAt?: string;
  isPrivate: boolean;
  name: string;
  exercises: WorkoutExerciseProps[];
  programUid?: string;
  status: WorkoutStatus;
  strainRating?: number;
  reflection?: string;
  likeUids?: string[];
  imageUri?: string;
  localImageUri?: string;
  imageBase64?: string;
  imageId?: string;
  userUid?: string;
  healthData?: HealthDataProps;
  type: HealthActivity;
}

export interface ResultActivityProps {
  predictVal: number;
  performVal: number;
  meas: string;
}

export const WorkoutTypes = {
  TraditionalStrengthTraining:
    AppleHealthKit.Constants.Activities.TraditionalStrengthTraining,
  Cycling: AppleHealthKit.Constants.Activities.Cycling,
  Swimming: AppleHealthKit.Constants.Activities.Swimming,
  Yoga: AppleHealthKit.Constants.Activities.Yoga,
  Walking: AppleHealthKit.Constants.Activities.Walking,
  Hiking: AppleHealthKit.Constants.Activities.Hiking,
  Running: AppleHealthKit.Constants.Activities.Running,
  Surfing: AppleHealthKit.Constants.Activities.SurfingSports,
  Activity: 'Activity',
};

export enum EventType {
  Pause = 'pause',
  Resume = 'resume',
  MotionPaused = 'motion paused',
  MotionResumed = 'motion resumed',
  PausedOrResumeRequest = 'pause or resume request',
  Lap = 'lap',
  Segment = 'segment',
  Marker = 'marker',
}

export interface DateValueProps {
  value: number;
  date: Date;
}

export interface HealthEvalProps {
  data: DateValueProps[];
  eval: string;
}

export interface HealthDataProps {
  _id?: string;
  workoutUid?: string;
  activityId: string;
  activityName: string & HealthActivity;
  sourceName: string;
  duration: number;
  calories: number;
  distance: number;
  heartRates?: number[];
  date: string;
  end?: string;
  start?: string;
  disMeas?: HealthDisMeas;
  userUid?: string;
  workoutEvents?: HKWorkoutEventType[];
}

export enum HealthDisMeas {
  mi = 'mi',
  km = 'km',
  m = 'm',
  yd = 'yd',
}

export interface WorkoutExercisesObjProps {
  [group: string]: WorkoutExerciseProps[];
}

export enum WorkoutStatus {
  pending = 'pending',
  inProgress = 'inProgress',
  completed = 'completed',
}

export interface WorkoutExerciseProps {
  _id?: string;
  remove?: boolean;
  workoutUid?: string;
  tempId?: string;
  data: WorkoutExerciseDataProps[];
  exerciseUid?: string;
  exercise?: ExerciseProps;
  group: number;
  order: number;
  sets?: number;
  reps?: number;
  calcRef?: number;
  comment?: string;
  date?: string;
  programWorkoutUid?: string;
  programTemplateUid?: string;
}

export interface WorkoutExerciseDataProps {
  _id?: string;
  reps: number;
  performVal?: number;
  predictVal: number;
  pct?: number;
  completed?: boolean;
  warmup?: boolean;
}

export interface WorkoutHeaderProps {
  _id?: string;
  name: string;
  isPrivate: boolean;
  description: string;
  programUid?: undefined | string;
  date: string;
  type: HealthActivity;
  status?: WorkoutStatus;
}

export interface EditWorkoutProps {
  _id?: string;
  name: string;
  isPrivate: boolean;
  description: string;
  programUid?: undefined | string;
  date: string;
  exercises: WorkoutExerciseProps[];
  type: HealthActivity;
  //for programs
  program?: boolean;
  daysFromStart?: number;
  programTemplateUid?: boolean;
}

interface SaveNewWorkoutExercises
  extends Omit<WorkoutExerciseProps, 'exercise' | 'tempId'> {
  exerciseUid: string;
}

export interface SaveEditWorkoutProps
  extends Omit<EditWorkoutProps, 'exercises'> {
  exercises: SaveNewWorkoutExercises[];
}

export interface DataArrProps {
  _id: string;
  tempId?: string;
  calcRef?: number;
  data: WorkoutExerciseDataProps[];
}

export interface WorkoutRouteProps {
  _id?: string;
  userUid: string;
  locations: LocationValue[];
}

export interface WorkoutActionProps {
  updateWorkoutExercises: (
    workoutUid: string,
    exercises: WorkoutExerciseProps[],
    removedExercises?: WorkoutExerciseProps[],
  ) => Promise<void>;
  fetchWorkouts: (
    FromDate: string,
    toDate: string,
  ) => Promise<void | undefined>;
  removeWorkout: (workoutUid: string) => Promise<void>;
  duplicateWorkout: (date: string) => Promise<void | undefined>;
  setViewProgram: (workoutUid: string, isProgram?: boolean) => undefined;
  updateWorkoutStatus: (
    workoutUid: string,
    status: WorkoutStatus,
  ) => Promise<void>;
  updateWorkoutExerciseData: (
    dataArr: DataArrProps[],
  ) => Promise<void | WorkoutExerciseProps[]>;
  completeWorkout: (
    workout: WorkoutProps,
    strainRating: number,
    reflection: string,
    image?: ImageProps,
  ) => Promise<void>;
  updateWorkoutHeader: (
    workoutHeader: WorkoutHeaderProps,
  ) => Promise<WorkoutHeaderProps[] | void>;
  addExerciseToWorkout: (
    exercise: ExerciseProps,
    group: number,
    order: number,
  ) => Promise<void>;
  setViewWorkout: (workoutUid: string) => Promise<void>;
  removeWorkoutExercise: (exercise: WorkoutExerciseProps) => Promise<void>;
  updateWoHealthData: (
    workoutUid: string,
    healthData: HealthDataProps,
  ) => Promise<void>;
  getAllHealthData: () => Promise<void>;
  updateWoWorkoutRoute: (
    workoutUid: string,
    locations: LocationValue[],
    activityId?: string,
  ) => Promise<WorkoutRouteProps | void>;
}
