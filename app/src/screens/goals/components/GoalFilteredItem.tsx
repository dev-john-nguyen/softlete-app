import React, { FC } from 'react';
import { FlexBox } from '@app/ui';
import { GoalProps } from 'src/services/goals/types';
import { PrimaryText } from '@app/elements';
import { Colors, DateTools, rgba } from '@app/utils';
import { GoalStatusProps } from '../types';
import Icon from '@app/icons';

type Props = {
  goal: GoalProps & GoalStatusProps;
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
      borderColor={active ? goal.color : undefined}
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
      <Icon
        icon="target"
        color={goal.color}
        size={18}
        containerStyles={{ position: 'absolute', top: 5, right: 5 }}
      />
    </FlexBox>
  );
};

export default GoalFilterItem;
