import React from 'react';
import { Pressable, ScrollView, StyleSheet } from 'react-native';
import { normalize } from '../../utils/tools';
import { WorkoutStatus } from '../../services/workout/types';
import { FlexBox } from '@app/ui';
import { Colors, rgba } from '@app/utils';
import { DemoArrow } from '@app/elements';
import Animated, {
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { DemoStates } from '@app/services';
import Icon from '@app/icons';

interface NavbarItemProps {
  index: number;
  curGroup: number;
  onPress: () => void;
  color: string;
  lightColor: string;
}

const circleWidth = normalize.width(18);

const NavbarItem = ({
  index,
  curGroup,
  onPress,
  color,
  lightColor,
}: NavbarItemProps) => {
  const animatedStyles = useAnimatedStyle(() => {
    const active = curGroup * 30 === index * 30 ? true : false;
    return {
      backgroundColor: active ? withTiming(color) : withTiming(lightColor),
      height: circleWidth,
      width: circleWidth,
      borderRadius: 100,
      marginRight: 10,
    };
  }, [curGroup, color]);

  return (
    <Pressable onPress={onPress} hitSlop={5}>
      <Animated.View key={index} style={animatedStyles} />
    </Pressable>
  );
};

interface Props {
  groupKeys: number[];
  onGroupPress: (key: number) => void;
  curGroup: number;
  onAddExercise: (newGroup: boolean) => void;
  status: WorkoutStatus;
  athlete?: boolean;
}

const WorkoutNavbar = ({
  groupKeys,
  onGroupPress,
  curGroup,
  onAddExercise,
  status,
  athlete,
}: Props) => {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      horizontal>
      <DemoArrow state={[DemoStates.WORKOUT_VIEW_ADD_EXERCISE_TOP]} />
      <FlexBox alignItems="center">
        {groupKeys.map((g, index) => (
          <NavbarItem
            index={index}
            curGroup={curGroup}
            key={index}
            onPress={() =>
              curGroup === g ? onAddExercise(false) : onGroupPress(g)
            }
            color={
              status === WorkoutStatus.completed ||
              (status === WorkoutStatus.inProgress &&
                curGroup === groupKeys[groupKeys.length - 1])
                ? Colors.green
                : Colors.white
            }
            lightColor={
              status === WorkoutStatus.completed
                ? rgba(Colors.greenRbg, 0.5)
                : rgba(Colors.whiteRbg, 0.2)
            }
          />
        ))}
        {status === WorkoutStatus.inProgress && (
          <Icon
            icon="notebook"
            onPress={() => onGroupPress(-2)}
            size={20}
            color={Colors.white}
          />
        )}
      </FlexBox>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1, // Ensures that the container will grow to fit the content if it's not full screen
    justifyContent: 'center', // Centers content vertically in the container
    alignItems: 'center', // Centers content horizontally in the container
  },
  reflect: {
    height: circleWidth,
    width: circleWidth,
    borderRadius: 100,
    backgroundColor: Colors.green,
    borderWidth: 1,
  },
});
export default WorkoutNavbar;
