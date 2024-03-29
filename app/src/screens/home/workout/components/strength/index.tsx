import { FlexBox } from '@app/ui';
import ExerciseBanner from './components/ExerciseBanner';
import EmptyPlaceholder from './components/EmptyPlaceholder';
import AddExercise from './components/AddExercise';
import ImportDeviceActivity from '../ImportDeviceActivity';
import { useWorkoutState } from '../../contexts';

const WorkoutStrength = () => {
  const { workout } = useWorkoutState();
  return (
    <FlexBox flex={1} column marginBottom={20}>
      {workout.exercises.length ? <ExerciseBanner /> : <EmptyPlaceholder />}
      <AddExercise />
      <ImportDeviceActivity />
    </FlexBox>
  );
};

export default WorkoutStrength;
