import { ParamListBase, RouteProp } from '@react-navigation/native';
import { HealthDataProps } from 'src/services/workout/types';
import { ExerciseProps } from '../../services/exercises/types';

export type NavigationProps = {
  goBack(): void;
  params: any;
  push(screen: HomeStackScreens, arg1: any): unknown;
};

export interface MyRouteProps extends RouteProp<ParamListBase, ''> {
  params: {
    data?: HealthDataProps;
  };
}

export type HomeStackParamsList = {
  push(screen: HomeStackScreens, arg1: { data: HealthDataProps }): unknown;
  Workout: undefined;
  WorkoutTemplate: undefined;
  WorkoutHeader: undefined;
  EditWorkout: undefined;
  AddExercise: undefined;
  SearchExercises: undefined;
  CreateExercise: undefined;
  UploadExerciseVideo: undefined;
  Exercise: {
    exercise: ExerciseProps;
    athlete?: boolean;
  };
  EditExercise: undefined;
  EditExerciseDetails: undefined;
  ReorderWorkoutExercises: undefined;
  Calendar: undefined;
  ExerciseAnalytics: undefined;
  WorkoutModal: undefined;
  GoOnlineModal: undefined;
  OverviewModal: undefined;
  DataOverview: undefined;
  Home: undefined;
  Subscribe: undefined;
  Map: undefined;
  Health: undefined;
  DeviceActivities: undefined;
  WorkoutActivitySummary: undefined;
};

export enum HomeStackScreens {
  SearchExercises = 'SearchExercises',
  Workout = 'Workout',
  WorkoutHeader = 'WorkoutHeader',
  ReorderWorkoutExercises = 'ReorderWorkoutExercises',
  Calendar = 'Calendar',
  ExerciseAnalytics = 'ExerciseAnalytics',
  Exercise = 'Exercise',
  EditExercise = 'EditExercise',
  WorkoutModal = 'WorkoutModal',
  GoOnlineModal = 'GoOnlineModal',
  OverviewModal = 'OverviewModal',
  UploadExerciseVideo = 'UploadExerciseVideo',
  DataOverview = 'DataOverview',
  EditExerciseDetails = 'EditExerciseDetails',
  Home = 'Home',
  Subscribe = 'Subscribe',
  Map = 'Map',
  Health = 'Health',
  DeviceActivities = 'DeviceActivities',
  WorkoutActivitySummary = 'WorkoutActivitySummary',
}

export enum HomeStackScreenTitle {
  SearchExercises = 'Search',
  Workout = 'Workout',
  WorkoutHeader = 'Details',
  ReorderWorkoutExercises = 'Restructure',
  Calendar = 'Home',
  Exercise = 'Exercise',
  EditExercise = 'Details',
  Map = 'Map',
}
