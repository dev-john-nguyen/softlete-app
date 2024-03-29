import { FlexBox } from '@app/ui';
import { useWorkoutState } from '../../../contexts';

const ExerciseBanner = () => {
  const { workout } = useWorkoutState();
  return <FlexBox alignItems="center" justifyContent="center" flex={1} />;
};

export default ExerciseBanner;
