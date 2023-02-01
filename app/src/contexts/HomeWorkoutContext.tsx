import React, { createContext, FC } from 'react';
import { ExerciseProps } from 'src/services/exercises/types';
import { GeneratedProgramProps } from 'src/services/program/types';
import { ImageProps } from 'src/services/user/types';
import {
  HealthDataProps,
  WorkoutExerciseProps,
  WorkoutStatus,
} from 'src/services/workout/types';

type HomeWorkoutContextProps = {
  onNavigateToExercise: (exercise: ExerciseProps) => void;
  onUpdateWoHealthData?: (
    workoutUid: string,
    activity: HealthDataProps,
  ) => Promise<void>;
  onNavigateToAddExercise?: (group: number, order: number) => void;
  onCompleteWorkout?: (
    exercises?: void | WorkoutExerciseProps[] | undefined,
  ) => Promise<void>;
  onUpdateStatus?: (status: WorkoutStatus) => Promise<void>;
  program?: GeneratedProgramProps;
  setReflection?: React.Dispatch<React.SetStateAction<string>>;
  setImage: React.Dispatch<React.SetStateAction<ImageProps | undefined>>;
  image?: ImageProps;
};

export const HomeWorkoutContext = createContext<HomeWorkoutContextProps>(
  {} as any,
);

type HomeWorkoutProviderProps = {
  children: JSX.Element;
};

export const HomeWorkoutProvider: FC<
  HomeWorkoutProviderProps & HomeWorkoutContextProps
> = ({
  children,
  onNavigateToExercise,
  onUpdateWoHealthData,
  onNavigateToAddExercise,
  onCompleteWorkout,
  onUpdateStatus,
  program,
  setReflection,
  setImage,
  image,
}) => {
  return (
    <HomeWorkoutContext.Provider
      value={{
        onNavigateToExercise,
        onUpdateWoHealthData,
        onNavigateToAddExercise,
        onCompleteWorkout,
        onUpdateStatus,
        program,
        setReflection,
        setImage,
        image,
      }}>
      {children}
    </HomeWorkoutContext.Provider>
  );
};
