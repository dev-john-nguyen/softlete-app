import { FlexBox } from '@app/ui';
import WorkoutHeader from './WorkoutHeader';
import WorkoutStages from './WorkoutStages';
import WorkoutStrength from './strength';

const WorkoutContainer = () => {
  return (
    <FlexBox column gap={20} flex={1}>
      <WorkoutHeader />
      <WorkoutStages />
      <WorkoutStrength />
    </FlexBox>
  );
};

export default WorkoutContainer;
