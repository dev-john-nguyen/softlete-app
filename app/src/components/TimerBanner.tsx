import React from 'react';
import { useSelector } from 'react-redux';
import { ReducerProps } from 'src/services';
import { PrimaryText } from './elements';
import { Colors } from '@app/utils';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { Dimensions, LayoutChangeEvent } from 'react-native';
import { FlexBox } from '@app/ui';
import { HomeStackScreens } from 'src/screens/home/types';
import { navigate } from 'src/RootNavigation';

const { height: screenHeight, width: screenWidth } = Dimensions.get('window');

export const TimerBanner = () => {
  const insets = useSafeAreaInsets();
  const translationY = useSharedValue(insets.top);
  const translationX = useSharedValue(insets.right);
  const widthOfBanner = useSharedValue(0);
  // Add initial position shared values
  const initialTranslationX = useSharedValue(insets.top);
  const initialTranslationY = useSharedValue(insets.right);
  const { time, isRunning } = useSelector((state: ReducerProps) => state.timer);
  const snapPoints = [0, screenWidth - insets.right - widthOfBanner.value];

  const panGesture = Gesture.Pan()
    .onStart(() => {
      // Save the current positions as initial positions
      initialTranslationX.value = translationX.value;
      initialTranslationY.value = translationY.value;
    })
    .onUpdate(event => {
      // Update positions based on the initial position plus the delta
      translationX.value = initialTranslationX.value + event.translationX;
      translationY.value = initialTranslationY.value + event.translationY;

      // Clamp the values to ensure the element doesn't go off-screen
      translationY.value = Math.min(
        Math.max(translationY.value, 50),
        screenHeight - 100,
      );
      translationX.value = Math.min(
        Math.max(translationX.value, 0),
        screenWidth - 100,
      );
    })
    .onEnd(() => {
      // Animate to the nearest snap point on gesture end
      const nearestSnapPoint = snapPoints.reduce((prev, curr) =>
        Math.abs(translationX.value - curr) <
        Math.abs(translationX.value - prev)
          ? curr
          : prev,
      );

      translationX.value = withTiming(nearestSnapPoint, {
        duration: 500,
        easing: Easing.out(Easing.exp),
      });
    });
  const onLayout = (e: LayoutChangeEvent) => {
    widthOfBanner.value = e.nativeEvent.layout.width;
  };

  const onPress = () => {
    navigate(HomeStackScreens.Timer);
    translationY.value = insets.top;
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateY: translationY.value },
        { translateX: translationX.value },
      ],
      position: 'absolute',
      padding: 10,
      borderRadius: 5,
      backgroundColor: Colors.white,
      zIndex: 1000,
    };
  }, [translationY]);

  const formatTimer = (time: number) => {
    if (time < 10) {
      return `0${time}`;
    }
    return time;
  };

  const timerText = `${formatTimer(time.hrs)}:${formatTimer(
    time.mins,
  )}:${formatTimer(time.secs)}`;

  if (!isRunning) {
    return null;
  }

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View style={animatedStyle} onLayout={onLayout}>
        <FlexBox flex={1} onPress={onPress}>
          <PrimaryText color={Colors.primary}>{timerText}</PrimaryText>
        </FlexBox>
      </Animated.View>
    </GestureDetector>
  );
};

export default TimerBanner;
