import React from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { normalize } from '../../utils/tools';
import { WorkoutStatus } from '../../services/workout/types';
import { FlexBox } from '@app/ui';
import { Colors, moderateScale, rgba, StyleConstants } from '@app/utils';
import { CircleAdd } from '@app/elements';
import Animated, {
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';

interface NavbarItemProps {
  index: number;
  curGroup: number;
  onPress: () => void;
  color: string;
  lightColor: string;
}

const activeWidth = normalize.width(20);
const inactiveWidth = normalize.width(30);

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
      height: active ? withTiming(activeWidth) : withTiming(inactiveWidth),
      width: active ? withTiming(activeWidth) : withTiming(inactiveWidth),
      borderRadius: 100,
      marginRight: 20,
    };
  }, [curGroup, color]);

  return (
    <Pressable style={styles.itemContainer} onPress={onPress} hitSlop={5}>
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
    <ScrollView style={styles.container} horizontal>
      <FlexBox alignItems="center">
        {status === WorkoutStatus.completed && <View style={styles.reflect} />}
        {groupKeys.map((g, index) => (
          <NavbarItem
            index={index}
            curGroup={curGroup}
            key={index}
            onPress={() =>
              curGroup === g ? onAddExercise(false) : onGroupPress(g)
            }
            color={
              status === WorkoutStatus.completed ? Colors.green : Colors.white
            }
            lightColor={
              status === WorkoutStatus.completed
                ? rgba(Colors.greenRbg, 0.5)
                : rgba(Colors.whiteRbg, 0.5)
            }
          />
        ))}
        {status === WorkoutStatus.inProgress && <View style={styles.reflect} />}
        {!athlete && status !== WorkoutStatus.completed && (
          <CircleAdd
            onPress={() => onAddExercise(true)}
            size={12}
            style={{
              position: 'relative',
              bottom: 0,
              padding: moderateScale(5),
            }}
          />
        )}
      </FlexBox>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    maxWidth: normalize.width(2),
    height: '100%',
  },
  itemContainer: {
    height: normalize.width(20),
    justifyContent: 'center',
  },
  reflect: {
    height: normalize.width(25),
    width: normalize.width(25),
    borderRadius: 100,
    borderColor: Colors.green,
    borderWidth: 1,
    marginRight: StyleConstants.baseMargin,
  },
});
export default WorkoutNavbar;
