import { FlexBox } from '@app/ui';
import { Colors } from '@app/utils';
import React, { useEffect } from 'react';
import PrimaryText from './PrimaryText';
import Icon from '@app/icons';
import { useDispatch, useSelector } from 'react-redux';
import { ReducerProps } from 'src/services';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { Dimensions } from 'react-native';
import { DemoStates, setDemoState, DemoStatePositions } from '@app/services';
import { CLEAR_DEMO_STATE_DATA } from 'src/services/global/actionTypes';

const { height: screenHeight } = Dimensions.get('window');

const Demo = () => {
  const translationY = useSharedValue(50);
  const initialTranslationY = useSharedValue(50);
  const { demo } = useSelector((state: ReducerProps) => ({
    demo: state.demo,
  }));
  const dispatch = useDispatch();

  const panGesture = Gesture.Pan()
    .onStart(() => {
      initialTranslationY.value = translationY.value;
    })
    .onUpdate(event => {
      translationY.value = initialTranslationY.value + event.translationY;
      translationY.value = Math.min(
        Math.max(translationY.value, 50),
        screenHeight - 50,
      );
    });

  useEffect(() => {
    // can reposition for certain stages
    if (
      demo.state &&
      DemoStatePositions[demo.state] &&
      typeof DemoStatePositions[demo.state].bannerY === 'number'
    ) {
      const value = DemoStatePositions[demo.state]?.bannerY || 50;
      translationY.value = value;
    }
  }, [demo, translationY]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translationY.value }],
      position: 'absolute',
      padding: 10,
      borderRadius: 5,
      backgroundColor: Colors.white,
      zIndex: 1000,
      maxWidth: '100%',
      flexDirection: 'row',
      alignItems: 'center',
    };
  });

  const demoStateHandler = (add: number) => () => {
    const demoStateArray = Object.values(DemoStates);
    const currentIndex = demoStateArray.findIndex(s => s === demo.state);
    if (currentIndex > -1) {
      const nextIndex = currentIndex + add;
      if (nextIndex >= demoStateArray.length) {
        exitHandler();
      } else if (nextIndex > -1 && nextIndex < demoStateArray.length) {
        dispatch(setDemoState(demoStateArray[currentIndex + add]));
      }
    }
  };

  const exitHandler = () => {
    dispatch(setDemoState(undefined));
    dispatch({ type: CLEAR_DEMO_STATE_DATA });
  };

  if (!demo.state) {
    return <></>;
  }

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View style={animatedStyle}>
        <FlexBox
          flex={1}
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
          <FlexBox
            column
            marginLeft={10}
            justifyContent="center"
            flex={1}
            marginRight={10}>
            <PrimaryText color={Colors.primary}>{demo.state}</PrimaryText>
          </FlexBox>
        </FlexBox>
        <FlexBox
          position="absolute"
          top={10}
          right={10}
          onPress={exitHandler}
          alignItems="center"
          justifyContent="center">
          <Icon icon="close" size={10} color={Colors.primary} />
        </FlexBox>
      </Animated.View>
    </GestureDetector>
  );
};

export default Demo;
