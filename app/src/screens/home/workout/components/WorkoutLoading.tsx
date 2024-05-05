import { ScreenTemplate } from '@app/elements';
import { FlexBox } from '@app/ui';
import { Colors } from '@app/utils';
import FontAwesome6Icon from 'react-native-vector-icons/FontAwesome6';
import { useGoBack } from '../hooks/general.hooks';
import { Animated } from 'react-native';
import { useEffect, useRef } from 'react';

const WorkoutLoading = () => {
  const { onGoBackHandler } = useGoBack();
  const spinValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Step 3: Configure the Animation
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1, // Rotate full circle
        duration: 2000, // Time in milliseconds
        useNativeDriver: true, // Use native driver for better performance
      }),
    ).start();
  }, [spinValue]);

  // Step 4: Interpolate the spinValue to map animation values to rotate values
  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'], // Rotate from 0 to 360 degrees
  });

  return (
    <ScreenTemplate isBackVisible onGoBack={onGoBackHandler}>
      <FlexBox
        column
        alignItems="center"
        justifyContent="center"
        flex={1}
        gap={10}>
        <Animated.View style={{ transform: [{ rotate: spin }] }}>
          <FontAwesome6Icon name="dumbbell" color={Colors.white} size={60} />
        </Animated.View>
      </FlexBox>
    </ScreenTemplate>
  );
};

export default WorkoutLoading;
