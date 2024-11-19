import Animated, {
  SharedValue,
  cancelAnimation,
  runOnJS,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useRef, FC } from 'react';
import { View, Vibration, StyleSheet } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { objectMove } from '../helpers';
import {
  CUSTOM_OFF_SET,
  ItemLayoutProps,
  ItemProps,
  Positions,
} from '../types';

interface Props {
  item: ItemProps<any>;
  setItemLayoutProps: React.Dispatch<
    React.SetStateAction<Map<string, ItemLayoutProps>>
  >;
  scrollLayoutProps: ItemLayoutProps | undefined;
  scrollY: SharedValue<number>;
  scrollViewHeight: number;
  isAnItemDragging: SharedValue<boolean>;
  positions: SharedValue<Positions>;
  updateCallback: (ids: string[]) => void;
  renderItem: (item: ItemProps<any>) => JSX.Element;
  gap: number;
}

const DragAndSortItem: FC<Props> = ({
  item,
  setItemLayoutProps,
  scrollLayoutProps,
  scrollY,
  scrollViewHeight,
  isAnItemDragging,
  positions,
  updateCallback,
  renderItem,
  gap,
}) => {
  const translateY = useSharedValue(0);
  const myComponentRef = useRef() as React.MutableRefObject<View>;
  const initializedPosition = useSharedValue(false);
  const isMoving = useSharedValue(false);

  useAnimatedReaction(
    () => positions.value[item.id]?.positionY,
    (currentPosition, previousPosition) => {
      if (
        currentPosition !== undefined &&
        currentPosition !== previousPosition &&
        !isMoving.value
      ) {
        if (initializedPosition.value) {
          translateY.value = withSpring(currentPosition);
        } else {
          translateY.value = currentPosition;
          initializedPosition.value = true;
        }
      }
    },
    [isMoving],
  );

  const finalizedPositions = () => {
    const ids = Object.keys(positions.value);
    const sortedPositions = ids.sort(
      (a, b) =>
        (positions.value[a]?.sortOrder as number) -
        (positions.value[b]?.sortOrder as number),
    );
    updateCallback(sortedPositions);
  };

  const autoScrollHandler = () => {
    'worklet';
    const scrollHeight = scrollLayoutProps?.height ?? 0;
    // auto scroll logic
    if (translateY.value <= scrollY.value + CUSTOM_OFF_SET) {
      scrollY.value = withTiming(0, { duration: 1500 });
    } else if (translateY.value >= scrollY.value + scrollHeight - 50) {
      const contentHeight = scrollViewHeight;
      const containerHeight = scrollHeight;
      const maxScroll = contentHeight - containerHeight;
      scrollY.value = withTiming(maxScroll, { duration: 1500 });
    } else {
      cancelAnimation(scrollY);
    }
  };

  const triggerSingleVibrate = () => Vibration.vibrate();

  const moveHandler = () => {
    'worklet';
    const orderedItemIds = Object.keys(positions.value).sort(
      (a, b) =>
        (positions.value[a].positionY as number) -
        (positions.value[b].positionY as number),
    );

    const currentIndex = orderedItemIds.indexOf(item.id as string);

    let newIndex = currentIndex;

    for (let i = 0; i < orderedItemIds.length; i++) {
      const itemId = orderedItemIds[i];
      if (itemId === (item.id as string)) {
        continue;
      }

      const itemPosition = positions.value[itemId]?.positionY as number;
      const itemHeight = positions.value[itemId]?.height as number;
      const dragPosition = translateY.value + itemHeight / 2;

      if (currentIndex < i && dragPosition > itemPosition + itemHeight / 2) {
        newIndex = i;
        break; // Found the new position, exit loop
      } else if (
        currentIndex > i &&
        dragPosition < itemPosition + itemHeight / 2
      ) {
        newIndex = Math.max(0, i); // Ensure newIndex isn't negative
        break; // Found the new position, exit loop
      }
    }
    if (newIndex !== currentIndex) {
      runOnJS(triggerSingleVibrate)();
      positions.value = objectMove(
        positions.value,
        item.id as string,
        newIndex,
        gap,
      );
    }
  };

  const longPress = Gesture.LongPress()
    .minDuration(500)
    .onStart(() => {
      isMoving.value = true;
    });

  const panGesture = Gesture.Pan()
    .manualActivation(true)
    .onTouchesMove((event, stateManager) => {
      if (isMoving.value) {
        stateManager.activate();
      } else {
        stateManager.fail();
      }
    })
    .onStart(() => {
      isMoving.value = true;
      isAnItemDragging.value = true;
    })
    .onUpdate(event => {
      const scrollPageY = scrollLayoutProps?.pageY ?? 0;
      const positionY = scrollY.value + event.absoluteY - CUSTOM_OFF_SET;
      translateY.value = positionY;
      autoScrollHandler();
      moveHandler();
    })
    .onEnd(() => {
      runOnJS(finalizedPositions)();
      isAnItemDragging.value = false;
      translateY.value = positions.value[item.id]?.positionY;
    })
    .onTouchesUp(() => {
      isMoving.value = false;
    });

  const animatedStyle = useAnimatedStyle(
    () => ({
      position: 'absolute',
      borderRadius: 10,
      top: translateY.value,
      zIndex: isMoving.value ? 100 : 1,
      backgroundColor: '#160303',
      shadowColor: '#3A1A1A',
      shadowOffset: {
        height: 5,
        width: 5,
      },
      shadowOpacity: withSpring(isMoving.value ? 1 : 0),
      shadowRadius: 10,
      padding: 10,
      borderWidth: 1,
      borderColor: '#3A1A1A',
    }),
    [isMoving],
  );

  const onLayout = () => {
    myComponentRef.current?.measure((x, y, width, height, pageX, pageY) => {
      const newLayoutMeasurements = {
        height: height,
        translateY: 0,
        pageX,
        pageY,
      };
      setItemLayoutProps(layoutProps => {
        const itemProps = layoutProps.get(item.id as string);
        if (itemProps) {
          layoutProps.set(item.id as string, {
            ...itemProps,
            ...newLayoutMeasurements,
          });
          return layoutProps; // don't rerender
        } else {
          layoutProps.set(item.id as string, newLayoutMeasurements);
        }
        return new Map(layoutProps);
      });
    });
  };

  const gesture = Gesture.Simultaneous(longPress, panGesture);

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View
        ref={myComponentRef}
        style={[styles.item, animatedStyle]}
        onLayout={onLayout}>
        {renderItem(item)}
      </Animated.View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  item: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
});

export default DragAndSortItem;
