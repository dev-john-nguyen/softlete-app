import Icon from '@app/icons';
import { FlexBox } from '@app/ui';
import { Colors } from '@app/utils';
import React, { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const AppLoadingIndicator = () => {
  const spinValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    spinValue.setValue(0);
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 10000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ).start();
  }, [spinValue]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <SafeAreaProvider style={{ backgroundColor: Colors.primary }}>
      <FlexBox flex={1} justifyContent="center" alignItems="center" column>
        <Animated.View
          style={{
            transform: [{ rotate: spin }],
          }}>
          <Icon icon="logo" variant="secondary" size={100} />
        </Animated.View>
      </FlexBox>
    </SafeAreaProvider>
  );
};

export default AppLoadingIndicator;
