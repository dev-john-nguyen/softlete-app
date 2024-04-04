import React, { createContext, FC, useContext } from 'react';
import { useSelector } from 'react-redux';
import { ReducerProps } from 'src/services';
import { ViewWorkoutProps } from 'src/types/workouts.types';

type WorkoutContextProps = {
  workout: ViewWorkoutProps;
  isProgram?: boolean;
};

export const WorkoutContext = createContext<WorkoutContextProps>({} as any);

interface ProviderProps {
  children: JSX.Element;
  isProgram?: boolean;
}

export const WorkoutContextProvider: FC<ProviderProps> = ({
  children,
  isProgram,
}) => {
  const { workout } = useSelector((state: ReducerProps) => ({
    workout: isProgram ? state.program.viewWorkout : state.workout.viewWorkout,
  }));
  return (
    <WorkoutContext.Provider value={{ workout }}>
      {children}
    </WorkoutContext.Provider>
  );
};

export const useWorkoutState = () => {
  return useContext(WorkoutContext);
};
