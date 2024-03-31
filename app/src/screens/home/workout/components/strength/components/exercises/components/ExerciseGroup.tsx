import { PrimaryText } from '@app/elements';
import { Colors, rgba } from '@app/utils';
import { StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  runOnJS,
  withTiming,
} from 'react-native-reanimated';
import { useEffect, useRef } from 'react';
import {
  ExerciseDataProps,
  ItemLayoutProps,
  ItemPositionProps,
} from '../types';

type Props = {
  index: number;
  item: any;
  setItemLayoutProps: React.Dispatch<
    React.SetStateAction<Map<string, ItemLayoutProps>>
  >;
  itemLayoutProps: Map<string, ItemLayoutProps>;
  itemPositions: Map<string, ItemPositionProps>;
  setItemPositions: React.Dispatch<
    React.SetStateAction<Map<string, ItemPositionProps>>
  >;
  setData: React.Dispatch<React.SetStateAction<ExerciseDataProps[]>>;
};

const lightColor = rgba(Colors.whiteRbg, 0.2);

const ExerciseGroup = ({
  index,
  item,
  setItemLayoutProps,
  itemLayoutProps,
  itemPositions,
  setItemPositions,
  setData,
}: Props) => {
  const translateY = useSharedValue(0);
  const isDragging = useSharedValue(false);
  const myComponentRef = useRef() as React.MutableRefObject<View>;

  useEffect(() => {
    const itemPos = itemPositions.get(item.id);
    if (itemPos && !isDragging.value) {
      translateY.value = withTiming(itemPos.positionY);
    }
  }, [isDragging.value, item.id, itemPositions, translateY]);

  const updateAllPositions = (draggedItemId: string, newIndex: number) => {
    const ids = [...itemPositions.keys()];

    // Calculate new translateY values for all items based on the new index of the dragged item
    const sortedItems = ids.sort(
      (a, b) =>
        (itemPositions.get(a)?.sortOrder as number) -
        (itemPositions.get(b)?.sortOrder as number),
    );

    // Remove the dragged item and splice it into its new position
    const removedItem = sortedItems.splice(
      sortedItems.indexOf(draggedItemId),
      1,
    )[0];

    sortedItems.splice(newIndex, 0, removedItem);

    const newItemPositions = new Map();
    // Update translateY based on new order
    let accumulatedHeight = 0;

    sortedItems.forEach((itemId, i) => {
      const props = itemPositions.get(itemId);
      newItemPositions.set(itemId, {
        ...props,
        positionY: accumulatedHeight,
        sortOrder: i,
      });
      const itemProps = itemLayoutProps.get(itemId);
      accumulatedHeight += (itemProps?.height as number) + 10;
    });

    setItemPositions(newItemPositions);
  };

  const moveHandler = (newPosition: number) => {
    translateY.value =
      newPosition + (itemPositions.get(item.id)?.originalY as number);

    const orderedItemIds = [...itemPositions.keys()].sort(
      (a, b) =>
        (itemPositions.get(a)?.positionY as number) -
        (itemPositions.get(b)?.positionY as number),
    );

    const currentIndex = orderedItemIds.indexOf(item.id);

    let newIndex = currentIndex;

    for (let i = 0; i < orderedItemIds.length; i++) {
      const itemId = orderedItemIds[i];
      if (itemId === item.id) {
        continue;
      }

      const itemPosition = itemPositions.get(itemId)?.positionY as number;
      const itemHeight = itemLayoutProps.get(itemId)?.height as number;
      const dragPosition =
        translateY.value + (itemLayoutProps.get(itemId)?.height as number) / 2;

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
      updateAllPositions(item.id, newIndex);
    }
  };

  const finalizedPositions = () => {
    setData(() => {
      const sortedPositions = Array.from(itemPositions.entries())
        .sort(
          (a, b) => (a[1]?.sortOrder as number) - (b[1]?.sortOrder as number),
        )
        .map(([, props]) => props.data);
      return sortedPositions;
    });
    setItemPositions(props => {
      props.forEach((prop, key) => {
        props.set(key, {
          ...prop,
          originalY: prop.positionY,
        });
      });
      return new Map(props);
    });
  };

  const gesture = Gesture.Pan()
    .onStart(() => {
      isDragging.value = true; // Set to true when the drag starts
    })
    .onUpdate(event => {
      runOnJS(moveHandler)(event.translationY);
    })
    .onEnd(() => {
      runOnJS(finalizedPositions)();
      isDragging.value = false; // Reset dragging state when the drag ends
    });

  const animatedStyle = useAnimatedStyle(() => ({
    // transform: [{ translateY: translateY.value }],
    position: 'absolute',
    top: translateY.value,
    zIndex: isDragging ? 100 : 1,
    backgroundColor: isDragging.value ? Colors.white : lightColor,
  }));

  const onLayout = () => {
    myComponentRef.current?.measure((x, y, width, height, pageX, pageY) => {
      const newLayoutMeasurements = {
        height: height,
        translateY: 0,
        pageX,
        pageY,
      };
      setItemLayoutProps(layoutProps => {
        const itemProps = layoutProps.get(item.id);
        if (itemProps) {
          layoutProps.set(item.id, {
            ...itemProps,
            ...newLayoutMeasurements,
          });
          return layoutProps; // don't rerender
        } else {
          layoutProps.set(item.id, newLayoutMeasurements);
        }
        return new Map(layoutProps);
      });
    });
  };

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View
        ref={myComponentRef}
        style={[styles.item, animatedStyle]}
        onLayout={onLayout}>
        <PrimaryText>{item.label}</PrimaryText>
      </Animated.View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  item: {
    height: 50,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
});

export default ExerciseGroup;
