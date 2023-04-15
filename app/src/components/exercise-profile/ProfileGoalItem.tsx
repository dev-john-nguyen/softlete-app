import Icon from '@app/icons';
import React, { FC, useState } from 'react';
import { FlexBox } from '@app/ui';
import PrimaryText from '../elements/PrimaryText';
import { ExerciseGoal } from 'src/services/goals/types';
import { Colors, DateTools } from '@app/utils';

const ProfileGoalItem: FC<ExerciseGoal> = goal => {
  const [isExpanded, setIsExpanded] = useState(false);
  return (
    <FlexBox
      borderRadius={5}
      marginRight={10}
      padding={15}
      column
      onPress={() => setIsExpanded(!isExpanded)}>
      <Icon icon="target" size={20} color={Colors.white} />
      <FlexBox column marginTop={10}>
        <PrimaryText opacity={0.6} marginBottom={2}>
          {DateTools.convertLocalStrToFormatStr(goal.endDate, '/', 'd', false)}
        </PrimaryText>
        {isExpanded && (
          <FlexBox column maxWidth={250} marginTop={5}>
            <PrimaryText size="small" opacity={0.6}>
              Name:
            </PrimaryText>
            <PrimaryText size="small">{goal.name}</PrimaryText>
            <PrimaryText size="small" opacity={0.6} marginTop={2}>
              Description:
            </PrimaryText>
            <PrimaryText size="small">{goal.description}</PrimaryText>
            <PrimaryText size="small" opacity={0.6} marginTop={2}>
              Target:
            </PrimaryText>
          </FlexBox>
        )}
        <PrimaryText size="medium">{goal.goal}</PrimaryText>
      </FlexBox>
    </FlexBox>
  );
};

export default ProfileGoalItem;
