import React, { createContext, FC, useContext } from 'react';
import { useSelector } from 'react-redux';
import { ReducerProps } from 'src/services';
import { ExerciseProps } from 'src/types/exercises.types';
import { GeneratedProgramProps } from 'src/services/program/types';
import {
  ViewWorkoutProps,
  WorkoutActionProps,
  WorkoutStatus,
} from 'src/types/workouts.types';

type WorkoutContextProps = {
  onNavigateToExercise: (exercise: ExerciseProps) => void;
  onNavigateToAddExercise?: (group: number, order: number) => void;
  onUpdateStatus?: (status: WorkoutStatus) => Promise<void>;
  program?: GeneratedProgramProps;
  setReflection?: React.Dispatch<React.SetStateAction<string>>;
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

export const useWorkoutState = () => {
  return useContext(WorkoutContext);
};
