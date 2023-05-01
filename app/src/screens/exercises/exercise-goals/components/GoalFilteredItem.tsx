import React, { FC } from 'react';
import { FlexBox } from '@app/ui';
import { ExerciseGoalProps } from 'src/services/goals/types';
import { PrimaryText } from '@app/elements';
import { Colors, DateTools, rgba } from '@app/utils';

type Props = {
  goal: ExerciseGoalProps;
  active?: boolean;
  onPress: () => void;
};

const GoalFilterItem: FC<Props> = ({ goal, active, onPress }) => {
  return (
    <FlexBox
      column
      onPress={onPress}
      padding={15}
      backgroundColor={Colors.lightPrimary}
      borderRadius={5}
      borderWidth={1}
      borderColor={rgba(Colors.whiteRbg, active ? 0.6 : 0)}
      applyBoxShadow
      marginRight={20}>
      <PrimaryText opacity={0.6} marginBottom={2}>
        End Date:
      </PrimaryText>
      <PrimaryText marginBottom={5}>
        {DateTools.convertLocalStrToFormatStr(goal.endDate, '/')}
      </PrimaryText>
      <PrimaryText opacity={0.6} marginBottom={2}>
        Name:
      </PrimaryText>
      <PrimaryText>{goal.name}</PrimaryText>
    </FlexBox>
  );
};

export default GoalFilterItem;
