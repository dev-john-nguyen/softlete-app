import React, { createContext, FC } from 'react';
import { useSelector } from 'react-redux';
import { ReducerProps } from 'src/services';
import { ExerciseProps } from 'src/services/exercises/types';
import { GeneratedProgramProps } from 'src/services/program/types';
import { ImageProps } from 'src/services/user/types';
import {
  HealthDataProps,
  ViewWorkoutProps,
  WorkoutActionProps,
  WorkoutExerciseProps,
  WorkoutStatus,
} from 'src/services/workout/types';

type WorkoutContextProps = {
  onNavigateToExercise: (exercise: ExerciseProps) => void;
  onNavigateToAddExercise?: (group: number, order: number) => void;
  onCompleteWorkout?: (
    exercises?: void | WorkoutExerciseProps[] | undefined,
  ) => Promise<void>;
  onUpdateStatus?: (status: WorkoutStatus) => Promise<void>;
  program?: GeneratedProgramProps;
  setReflection?: React.Dispatch<React.SetStateAction<string>>;
  setImage?: React.Dispatch<React.SetStateAction<ImageProps | undefined>>;
  image?: ImageProps;
  isProgram?: boolean;
  athlete?: boolean;
  updateWoHealthData?: WorkoutActionProps['updateWoHealthData'];
  workout: ViewWorkoutProps;
};

export const WorkoutContext = createContext<WorkoutContextProps>({} as any);

interface ProviderProps extends Omit<WorkoutContextProps, 'workout'> {
  children: JSX.Element;
}

export const WorkoutProvider: FC<ProviderProps> = ({ children, ...props }) => {
  const { workout } = useSelector((state: ReducerProps) => ({
    workout: props.isProgram
      ? state.program.viewWorkout
      : state.workout.viewWorkout,
  }));
  return (
    <WorkoutContext.Provider value={{ ...props, workout }}>
      {children}
    </WorkoutContext.Provider>
  );
};
