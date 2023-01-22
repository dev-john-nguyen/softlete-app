import { normalize, useResizeStyles } from '@app/utils';
import React from 'react';
import { View, StyleProp, Pressable } from 'react-native';

// box shadows

type FlexBoxProps = {
  children: JSX.Element;
  onPress?: () => void;
  screenWidth?: boolean;
  screenWidthPct?: number;
  column?: boolean;
} & StyleProp<any>;

const FlexBox = ({
  children,
  flexDirection = 'row',
  onPress,
  onLongPress,
  screenWidth,
  screenWidthPct,
  column,
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
        onLongPress={onLongPress}>
        {children}
      </Pressable>
    );
  }

  return (
    <View
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
