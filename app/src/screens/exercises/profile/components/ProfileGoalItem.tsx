import Icon from '@app/icons';
import React, { FC, useState } from 'react';
import { FlexBox } from '@app/ui';
import PrimaryText from '../../../../components/elements/PrimaryText';
import { ExerciseGoal } from 'src/services/goals/types';
import { Colors, DateTools } from '@app/utils';
import { Alert } from 'react-native';
import { useDispatch } from 'react-redux';
import { AppDispatch } from 'App';
import { removeExerciseGoalAsync } from 'src/services/goals/slice';

const ProfileGoalItem: FC<ExerciseGoal> = goal => {
  const [isExpanded, setIsExpanded] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  const onDeleteConfirmation = () => {
    if (!goal._id) return;
    dispatch(removeExerciseGoalAsync(goal._id))
      .unwrap()
      .catch(err => {
        console.log(err);
      });
  };

  const onDelete = () => {
    Alert.alert(
      'Confirmation',
      "Are you sure you want to delete this goal? You can't undo this action.",
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        { text: 'OK', onPress: onDeleteConfirmation },
      ],
    );
  };

  return (
    <FlexBox
      backgroundColor={Colors.lightPrimary}
      borderRadius={5}
      marginRight={10}
      padding={15}
      column
      onPress={() => setIsExpanded(!isExpanded)}>
      <FlexBox justifyContent="space-between">
        <Icon icon="target" size={20} color={Colors.white} />
        {isExpanded && (
          <Icon
            icon="trash_bin"
            size={18}
            color={Colors.white}
            onPress={onDelete}
          />
        )}
      </FlexBox>
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
