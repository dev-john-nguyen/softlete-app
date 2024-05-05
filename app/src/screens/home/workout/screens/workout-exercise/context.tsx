import { WorkoutExerciseDataMetrics } from '@app/services';
import { FC, createContext, useContext, useState } from 'react';

export type ActiveNumericItem = {
  id: string;
  metric: WorkoutExerciseDataMetrics;
};

type WorkoutExerciseContext = {
  setIsNumericKeypadOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isNumericKeypadOpen: boolean;
  setNumericValue: React.Dispatch<React.SetStateAction<number>>;
  numericValue: number;
  onTriggerNumericKeyboard: (
    id: ActiveNumericItem,
    defaultValue: number,
  ) => void;
  activeNumericItem: ActiveNumericItem | undefined;
  setActiveNumericItem: React.Dispatch<
    React.SetStateAction<ActiveNumericItem | undefined>
  >;
};

const WorkoutExerciseContext = createContext<WorkoutExerciseContext | null>(
  null,
);

type Props = {
  children: JSX.Element[] | JSX.Element;
};

export const WorkoutExerciseContextProvider: FC<Props> = ({ children }) => {
  const [activeNumericItem, setActiveNumericItem] =
    useState<ActiveNumericItem>();
  const [isNumericKeypadOpen, setIsNumericKeypadOpen] = useState(false);
  const [numericValue, setNumericValue] = useState(0);

  const onTriggerNumericKeyboard = (
    activeItem: ActiveNumericItem,
    defaultValue: number,
  ) => {
    setActiveNumericItem(activeItem);
    setNumericValue(defaultValue);
    setIsNumericKeypadOpen(true);
  };

  return (
    <WorkoutExerciseContext.Provider
      value={{
        setNumericValue,
        numericValue,
        isNumericKeypadOpen,
        setIsNumericKeypadOpen,
        activeNumericItem,
        setActiveNumericItem,
        onTriggerNumericKeyboard,
      }}>
      {children}
    </WorkoutExerciseContext.Provider>
  );
};

export const useWorkoutExerciseState = () => {
  const state = useContext(WorkoutExerciseContext);
  if (!state) throw new Error('This state is not availabe here');
  return state;
};
