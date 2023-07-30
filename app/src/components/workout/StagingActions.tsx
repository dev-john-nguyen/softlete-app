import { Colors, rgba } from '@app/utils';
import React from 'react';
import { StyleSheet, Pressable } from 'react-native';
import { WorkoutStatus } from '../../services/workout/types';
import PrimaryText from '../elements/PrimaryText';
import { FlexBox } from '@app/ui';

interface Props {
  status: WorkoutStatus;
  onUpdateStatus?: (status: WorkoutStatus) => void;
  athlete?: boolean;
}

const StagingActions = ({ status, onUpdateStatus, athlete }: Props) => {
  const onPress = (s: WorkoutStatus) => {
    if (status === s || athlete) return;
    onUpdateStatus && onUpdateStatus(s);
  };

  return (
    <FlexBox
      marginRight={15}
      marginLeft={15}
      marginBottom={10}
      borderRadius={100}
      alignSelf="center"
      backgroundColor={rgba(Colors.whiteRbg, 0.05)}>
      <Pressable
        style={({ pressed }) => [
          styles.tabContainer,
          {
            backgroundColor:
              pressed && !athlete
                ? status === WorkoutStatus.completed
                  ? rgba(Colors.greenRbg, 0.1)
                  : rgba(Colors.whiteRbg, 0.2)
                : status === WorkoutStatus.pending
                ? rgba(Colors.whiteRbg, 0.1)
                : 'transparent',
            borderTopLeftRadius: 100,
            borderBottomLeftRadius: 100,
            borderRadius:
              status === WorkoutStatus.pending || (pressed && !athlete)
                ? 100
                : undefined,
          },
        ]}
        onPress={() => onPress(WorkoutStatus.pending)}>
        <PrimaryText
          color={
            status === WorkoutStatus.pending ? Colors.white : Colors.lightWhite
          }>
          Pending
        </PrimaryText>
      </Pressable>

      <Pressable
        style={({ pressed }) => [
          styles.tabContainer,
          {
            backgroundColor:
              pressed && !athlete
                ? status === WorkoutStatus.completed
                  ? rgba(Colors.greenRbg, 0.1)
                  : rgba(Colors.whiteRbg, 0.2)
                : status === WorkoutStatus.inProgress
                ? rgba(Colors.whiteRbg, 0.1)
                : 'transparent',
            borderRadius:
              status === WorkoutStatus.inProgress || (pressed && !athlete)
                ? 100
                : undefined,
          },
        ]}
        onPress={() => onPress(WorkoutStatus.inProgress)}>
        <PrimaryText
          color={
            status === WorkoutStatus.pending ? Colors.white : Colors.lightWhite
          }>
          Performing
        </PrimaryText>
      </Pressable>

      <Pressable
        style={({ pressed }) => [
          styles.tabContainer,
          {
            backgroundColor:
              pressed && !athlete
                ? rgba(Colors.greenRbg, 0.1)
                : status === WorkoutStatus.completed
                ? Colors.green
                : 'transparent',
            borderTopRightRadius: 100,
            borderBottomRightRadius: 100,
            borderRadius:
              status === WorkoutStatus.completed || (pressed && !athlete)
                ? 100
                : undefined,
          },
        ]}
        onPress={() => onPress(WorkoutStatus.completed)}>
        <PrimaryText
          color={
            status === WorkoutStatus.pending ? Colors.white : Colors.lightWhite
          }>
          Completed
        </PrimaryText>
      </Pressable>
    </FlexBox>
  );
};

const styles = StyleSheet.create({
  tabContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
  },
});
export default StagingActions;
