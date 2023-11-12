import { Colors, normalize, rgba, useResizeStyles } from '@app/utils';
import React from 'react';
import {
  View,
  StyleProp,
  Pressable,
  LayoutChangeEvent,
  StyleSheet,
} from 'react-native';

// box shadows

type FlexBoxProps = {
  children: JSX.Element;
  onPress?: () => void;
  onPressOut?: () => void;
  onPressIn?: () => void;
  screenWidth?: boolean;
  screenWidthPct?: number;
  column?: boolean;
  onLayout?: (e: LayoutChangeEvent) => void;
  onLayoutExtract?: (data: {
    height: number;
    width: number;
    x: number;
    y: number;
  }) => void;
  applyBoxShadow?: boolean;
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
  applyBoxShadow,
  onLayoutExtract,
  onPressOut,
  onPressIn,
  ...stylesProp
}: FlexBoxProps) => {
  const styles = useResizeStyles(stylesProp);

  const onLayoutHandler = (e: LayoutChangeEvent) => {
    if (!e) return;
    onLayout && onLayout(e);
    const { height, width, x, y } = e.nativeEvent.layout;
    onLayoutExtract && onLayoutExtract({ height, width, x, y });
  };

  const width = screenWidth
    ? normalize.width(1)
    : screenWidthPct
    ? normalize.width(1) * screenWidthPct
    : styles.width;
  const direction = column ? 'column' : flexDirection;

  if (onPress || onLongPress || onPressOut || onPressIn) {
    return (
      <Pressable
        style={[
          {
            flexDirection: direction,
            width,
          },
          styles,
          applyBoxShadow ? flexStyles.boxShadow : undefined,
        ]}
        onPress={onPress}
        onLongPress={onLongPress}
        onPressOut={onPressOut}
        onPressIn={onPressIn}
        hitSlop={5}
        onLayout={onLayoutHandler}>
        {children}
      </Pressable>
    );
  }

  return (
    <View
      onLayout={onLayoutHandler}
      style={[
        {
          flexDirection: direction,
          width,
        },
        styles,
        applyBoxShadow ? flexStyles.boxShadow : undefined,
      ]}>
      {children}
    </View>
  );
};

const flexStyles = StyleSheet.create({
  boxShadow: {
    shadowColor: rgba(Colors.whiteRbg, 0.2),
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 20,
  },
});

export default FlexBox;
