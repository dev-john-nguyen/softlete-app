import { normalize, useResizeStyles } from '@app/utils';
import React from 'react';
import { View, StyleProp, Pressable, LayoutChangeEvent } from 'react-native';

// box shadows

type FlexBoxProps = {
  children: JSX.Element;
  onPress?: () => void;
  screenWidth?: boolean;
  screenWidthPct?: number;
  column?: boolean;
  onLayout?: (e: LayoutChangeEvent) => void;
} & StyleProp<any>;

const FlexBox = ({
  children,
  flexDirection = 'row',
  onPress,
  onLongPress,
  screenWidth,
  screenWidthPct,
  column,
  onLayout,
  ...stylesProp
}: FlexBoxProps) => {
  const styles = useResizeStyles(stylesProp);

  const width = screenWidth
    ? normalize.width(1)
    : screenWidthPct
    ? normalize.width(1) * screenWidthPct
    : styles.width;
  const direction = column ? 'column' : flexDirection;

  if (onPress || onLongPress) {
    return (
      <Pressable
        style={[
          {
            flexDirection: direction,
            width,
          },
          styles,
        ]}
        onPress={onPress}
        onLongPress={onLongPress}
        hitSlop={5}
        onLayout={onLayout}>
        {children}
      </Pressable>
    );
  }

  return (
    <View
      onLayout={onLayout}
      style={[
        {
          flexDirection: direction,
          width,
        },
        styles,
      ]}>
      {children}
    </View>
  );
};

export default FlexBox;
