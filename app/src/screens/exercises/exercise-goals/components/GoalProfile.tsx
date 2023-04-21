import { PrimaryButton, PrimaryText } from '@app/elements';
import { FlexBox } from '@app/ui';
import React from 'react';
import { ExerciseGoal } from 'src/services/goals/types';
type Props = {
  goal: ExerciseGoal;
};
const GoalProfile: React.FC<Props> = ({ goal }) => {
  return (
    <FlexBox column marginTop={20} alignItems="flex-start">
      <PrimaryButton textTransform="capitalize">{goal.status}</PrimaryButton>
      <PrimaryText opacity={0.6} marginTop={10}>
        Name:
      </PrimaryText>
      <PrimaryText>{goal.name}</PrimaryText>

      <PrimaryText opacity={0.6} marginTop={5}>
        Description:
      </PrimaryText>
      <PrimaryText>{goal.description}</PrimaryText>
      <PrimaryText opacity={0.6} marginTop={5}>
        Date Range:
      </PrimaryText>

      <PrimaryText opacity={0.6} marginTop={5}>
        Target:
      </PrimaryText>
      <PrimaryText>{goal.goal}</PrimaryText>
    </FlexBox>
  );
};

export default GoalProfile;
