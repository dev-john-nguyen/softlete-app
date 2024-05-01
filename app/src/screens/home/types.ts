import { ParamListBase, RouteProp } from '@react-navigation/native';
import { HealthDataProps } from 'src/types/workouts.types';
import { ExerciseProps } from '../../types/exercises.types';
import { GoalProps, GoalTypes } from 'src/services/goals/types';

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
  SearchExercises: {
    group: number;
    order: number;
    workoutUid: string;
    programTemplateUid?: string;
    goBackScreen: any;
  };
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
  GoalFormModal: {
    exercise?: ExerciseProps;
    goal?: GoalProps;
    type: GoalTypes;
  };
  GoOnlineModal: undefined;
  DataOverview: undefined;
  Home: undefined;
  Subscribe: undefined;
  Map: undefined;
  Health: undefined;
  DeviceActivities: undefined;
  WorkoutActivitySummary: undefined;
  Goals: { type: GoalTypes; exercise?: ExerciseProps };
  HealthGoalForm: undefined;
  EnduranceAnalytics: undefined;
  WorkoutHelp: undefined;
  Timer: undefined;
  WorkoutReflectionModal: undefined;
  WorkoutGroupExercises: {
    groupIndex: number;
    workoutUid: string;
  };
  WorkoutExercise: {
    workoutUid: string;
    exerciseUid: string;
  };
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
  GoalFormModal = 'GoalFormModal',
  Goals = 'Goals',
  GoOnlineModal = 'GoOnlineModal',
  UploadExerciseVideo = 'UploadExerciseVideo',
  DataOverview = 'DataOverview',
  EditExerciseDetails = 'EditExerciseDetails',
  Home = 'Home',
  Subscribe = 'Subscribe',
  Map = 'Map',
  Health = 'Health',
  DeviceActivities = 'DeviceActivities',
  WorkoutActivitySummary = 'WorkoutActivitySummary',
  HealthGoalForm = 'HealthGoalForm',
  EnduranceAnalytics = 'EnduranceAnalytics',
  WorkoutHelp = 'WorkoutHelp',
  Timer = 'Timer',
  WorkoutReflectionModal = 'WorkoutReflectionModal',
  WorkoutGroupExercises = 'WorkoutGroupExercises',
  WorkoutExercise = 'WorkoutExercise',
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
  WorkoutHelp = 'WorkoutHelp',
  Timer = 'Timer',
  WorkoutGroupExercises = 'WorkoutGroupExercises',
  WorkoutExercise = 'WorkoutExercise',
}
