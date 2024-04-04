import React, { createContext, FC, useContext } from 'react';
import { WorkoutProps } from 'src/types/workouts.types';

type WorkoutContextProps = {
  workout: WorkoutProps;
  isProgram?: boolean;
};

export const WorkoutContext = createContext<WorkoutContextProps>({} as any);

interface ProviderProps {
  children: JSX.Element;
  isProgram?: boolean;
  workout: WorkoutProps;
}

export const WorkoutContextProvider: FC<ProviderProps> = ({
  children,
  isProgram,
  workout,
}) => {
  return (
    <WorkoutContext.Provider value={{ workout }}>
      {children}
    </WorkoutContext.Provider>
  );
};

export const useWorkoutState = () => {
  return useContext(WorkoutContext);
};
