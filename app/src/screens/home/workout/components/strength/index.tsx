import { FlexBox } from '@app/ui';
import EmptyPlaceholder from './components/EmptyPlaceholder';
import AddExercise from './components/AddExercise';
import ImportDeviceActivity from '../ImportDeviceActivity';
import { useWorkoutState } from '../../contexts';
import ExercisesContainer from './components/exercises';

const WorkoutStrength = () => {
  const { workout } = useWorkoutState();
  return (
    <FlexBox flex={1} column marginBottom={20}>
      {workout.exercises.length ? <ExercisesContainer /> : <EmptyPlaceholder />}
      <AddExercise />
      <ImportDeviceActivity />
    </FlexBox>
  );
};

export default WorkoutStrength;
