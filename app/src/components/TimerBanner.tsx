import React from 'react';
import { useSelector } from 'react-redux';
import { ReducerProps } from 'src/services';
import { PrimaryText } from './elements';
import { Colors } from '@app/utils';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PanGestureHandler } from 'react-native-gesture-handler';
import Animated, {
  Easing,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
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
  const { time } = useSelector((state: ReducerProps) => state.timer);
  const snapPoints = [0, screenWidth - insets.right - widthOfBanner.value];

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, context: any) => {
      context.startY = translationY.value;
      context.startX = translationX.value;
    },
    onActive: (event, context) => {
      translationY.value = context.startY + event.translationY;
      translationY.value = Math.min(
        Math.max(translationY.value, 50),
        screenHeight - insets.bottom - 100,
      );

      translationX.value = context.startX + event.translationX;
      translationX.value = Math.min(
        Math.max(translationX.value, insets.left),
        screenWidth - insets.right - widthOfBanner.value,
      );
    },
    onEnd: () => {
      // Determine the nearest snap point
      const nearestSnapPoint = snapPoints.reduce((closest, point) => {
        return Math.abs(translationX.value - point) <
          Math.abs(translationX.value - closest)
          ? point
          : closest;
      }, snapPoints[0]);

      // Animate to the nearest snap point
      translationX.value = withTiming(nearestSnapPoint, {
        easing: Easing.inOut(Easing.ease),
      });
    },
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
    if (time < 10) return `0${time}`;
    return time;
  };

  const timerText = `${formatTimer(time.hrs)}:${formatTimer(
    time.mins,
  )}:${formatTimer(time.secs)}`;

  if (!time.hrs && !time.mins && !time.secs) return null;

  return (
    <PanGestureHandler onGestureEvent={gestureHandler}>
      <Animated.View style={animatedStyle} onLayout={onLayout}>
        <FlexBox flex={1} onPress={onPress}>
          <PrimaryText color={Colors.primary}>{timerText}</PrimaryText>
        </FlexBox>
      </Animated.View>
    </PanGestureHandler>
  );
};

export default TimerBanner;
