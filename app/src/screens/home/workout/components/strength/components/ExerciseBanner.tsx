import { FlexBox } from '@app/ui';
import { useWorkout } from '../../../contexts';

const ExerciseBanner = () => {
  const { workout } = useWorkout();
  return <FlexBox alignItems="center" justifyContent="center" flex={1} />;
};

export default ExerciseBanner;
