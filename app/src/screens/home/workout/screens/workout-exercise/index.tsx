import { ScreenTemplate } from '@app/elements';
import WorkoutHeaderExercise from './components/WorkoutExerciseHeader';
import WorkoutExerciseMetrics from './components/WorkoutExerciseMetrics';
import {
  WorkoutExerciseContextProvider,
  useWorkoutExerciseState,
} from './context';
import { useDispatch } from 'react-redux';
import { updateExerciseMetric } from '@app/services';
import { useActiveExercise } from '../../hooks/strength.hook';

const ContentContainer = () => {
  const exercise = useActiveExercise();
  const {
    numericValue,
    isNumericKeypadOpen,
    setNumericValue,
    setIsNumericKeypadOpen,
    activeNumericItem,
  } = useWorkoutExerciseState();

  const dispatch = useDispatch();

  const onNumberKeypadSubmit = (value: number) => {
    if (exercise && activeNumericItem) {
      dispatch(
        updateExerciseMetric({
          exerciseUid: exercise._id,
          metricUid: activeNumericItem.id,
          metric: activeNumericItem.metric,
          value: value,
        }),
      );
    }
    setNumericValue(value);
    setIsNumericKeypadOpen(false);
  };

  return (
    <ScreenTemplate
      isBackVisible
      applyContentPadding
      applyKeyboardDismiss
      defaultNumericValue={numericValue}
      isNumericKeypadOpen={isNumericKeypadOpen}
      onNumberKeypadSubmit={onNumberKeypadSubmit}>
      <WorkoutHeaderExercise />
      <WorkoutExerciseMetrics />
    </ScreenTemplate>
  );
};

const WorkoutExercise = () => {
  return (
    <WorkoutExerciseContextProvider>
      <ContentContainer />
    </WorkoutExerciseContextProvider>
  );
};

export default WorkoutExercise;
