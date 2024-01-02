import React from 'react';
import { Pressable, ScrollView, StyleSheet } from 'react-native';
import { normalize } from '../../utils/tools';
import { WorkoutStatus } from '../../services/workout/types';
import { FlexBox } from '@app/ui';
import { Colors, rgba } from '@app/utils';
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
    <FlexBox
      flexShrink={1}
      padding={10}
      alignItems="center"
      justifyContent="center">
      <FlexBox flex={0.5}>
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.contentContainer}
          horizontal>
          <FlexBox alignItems="center" flex={1}>
            {groupKeys.length > 0 ? (
              groupKeys.map((g, index) => (
                <NavbarItem
                  index={index}
                  curGroup={curGroup}
                  key={index}
                  onPress={() =>
                    curGroup === g ? onAddExercise(false) : onGroupPress(g)
                  }
                  color={Colors.white}
                  lightColor={rgba(Colors.whiteRbg, 0.2)}
                />
              ))
            ) : (
              <FlexBox
                width={circleWidth}
                height={circleWidth}
                backgroundColor={Colors.white}
                borderRadius={100}
                opacity={0.2}
              />
            )}
          </FlexBox>
        </ScrollView>
      </FlexBox>
    </FlexBox>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 100,
    backgroundColor: rgba(Colors.whiteRbg, 0.05),
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
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
