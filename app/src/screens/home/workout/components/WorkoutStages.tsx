import { FlexBox } from '@app/ui';
import { Colors, rgba } from '@app/utils';
import { Pressable, StyleSheet } from 'react-native';
import { PrimaryText } from '@app/elements';
import { WorkoutStatus } from 'src/types/workouts.types';
import { updateWorkoutStatus } from 'src/services/workout/actions';
import { useDispatch } from 'react-redux';
import { ThunkAppDispatch } from 'src/services';
import { useWorkout } from '../contexts';
import { updateStatus } from '@app/services';

const WorkoutStages = () => {
  const { workout, isProgram } = useWorkout();
  const dispatch = useDispatch<ThunkAppDispatch>();
  const status = workout.status;

  const onPress = (s: WorkoutStatus) => {
    if (status === s) {
      return;
    }
    dispatch(updateStatus(s));
  };

  if (isProgram) {
    return null;
  }

  return (
    <FlexBox
      marginLeft={15}
      marginRight={15}
      borderRadius={100}
      alignSelf="center"
      backgroundColor={rgba(Colors.whiteRbg, 0.05)}>
      <Pressable
        style={({ pressed }) => [
          styles.tabContainer,
          {
            backgroundColor: pressed
              ? status === WorkoutStatus.completed
                ? rgba(Colors.greenRbg, 0.1)
                : rgba(Colors.whiteRbg, 0.2)
              : status === WorkoutStatus.pending
              ? rgba(Colors.whiteRbg, 0.1)
              : 'transparent',
            borderTopLeftRadius: 100,
            borderBottomLeftRadius: 100,
            borderRadius:
              status === WorkoutStatus.pending || pressed ? 100 : undefined,
          },
        ]}
        onPress={() => onPress(WorkoutStatus.pending)}>
        <PrimaryText
          fontSize={14}
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
            backgroundColor: pressed
              ? status === WorkoutStatus.completed
                ? rgba(Colors.greenRbg, 0.1)
                : rgba(Colors.whiteRbg, 0.2)
              : status === WorkoutStatus.inProgress
              ? rgba(Colors.whiteRbg, 0.1)
              : 'transparent',
            borderRadius:
              status === WorkoutStatus.inProgress || pressed ? 100 : undefined,
          },
        ]}
        onPress={() => onPress(WorkoutStatus.inProgress)}>
        <PrimaryText
          fontSize={14}
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
            backgroundColor: pressed
              ? rgba(Colors.greenRbg, 0.1)
              : status === WorkoutStatus.completed
              ? Colors.green
              : 'transparent',
            borderTopRightRadius: 100,
            borderBottomRightRadius: 100,
            borderRadius:
              status === WorkoutStatus.completed || pressed ? 100 : undefined,
          },
        ]}
        onPress={() => onPress(WorkoutStatus.completed)}>
        <PrimaryText
          fontSize={14}
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
    paddingTop: 10,
    paddingBottom: 10,
  },
});
export default WorkoutStages;
