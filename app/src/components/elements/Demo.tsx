import { FlexBox } from '@app/ui';
import { Colors } from '@app/utils';
import React from 'react';
import PrimaryText from './PrimaryText';
import Icon from '@app/icons';
import { useDispatch, useSelector } from 'react-redux';
import { ReducerProps } from 'src/services';
import { PanGestureHandler } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { Dimensions } from 'react-native';
import { DemoStates, setDemoState } from '@app/services';

const { height: screenHeight } = Dimensions.get('window');

const Demo = () => {
  const translationY = useSharedValue(50);
  const { demo } = useSelector((state: ReducerProps) => ({
    demo: state.demo,
  }));
  const dispatch = useDispatch();

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, context: any) => {
      context.startY = translationY.value;
    },
    onActive: (event, context) => {
      translationY.value = context.startY + event.translationY;
      translationY.value = Math.min(
        Math.max(translationY.value, 50),
        screenHeight - 50,
      );
    },
    onEnd: () => {
      // action
    },
  });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translationY.value }],
      position: 'absolute',
      padding: 10,
      borderRadius: 5,
      backgroundColor: Colors.white,
      zIndex: 1000,
      maxWidth: '95%',
      flexDirection: 'row',
      alignItems: 'center',
    };
  });

  const demoStateHandler = (add: number) => () => {
    const demoStateArray = Object.values(DemoStates);
    const currentIndex = demoStateArray.findIndex(s => s === demo.state);
    if (currentIndex > -1) {
      const nextIndex = currentIndex + add;
      if (nextIndex > -1 && nextIndex < demoStateArray.length) {
        dispatch(setDemoState(demoStateArray[currentIndex + add]));
      }
    }
  };

  if (!demo.state) return <></>;

  return (
    <PanGestureHandler onGestureEvent={gestureHandler}>
      <Animated.View style={animatedStyle}>
        <FlexBox
          alignItems="center"
          onPress={demoStateHandler(1)}
          onLongPress={demoStateHandler(-1)}>
          <FlexBox
            alignItems="center"
            justifyContent="center"
            backgroundColor={Colors.primary}
            padding={8}
            borderRadius={100}>
            <Icon icon="bot" size={20} color={Colors.white} />
          </FlexBox>
          <FlexBox column marginLeft={10} justifyContent="center" flex={1}>
            <PrimaryText color={Colors.primary}>{demo.state}</PrimaryText>
          </FlexBox>
        </FlexBox>
      </Animated.View>
    </PanGestureHandler>
  );
};

export default Demo;
