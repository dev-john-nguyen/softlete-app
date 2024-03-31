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
import { ItemLayoutAttributesProps } from '../types';

type Props = {
  index: number;
  item: any;
  setItemLayoutProps: React.Dispatch<
    React.SetStateAction<{
      [id: string]: ItemLayoutAttributesProps;
    }>
  >;
  itemLayoutProps: { [id: string]: ItemLayoutAttributesProps };
  itemPositions: Map<any, any>;
  setItemPositions: React.Dispatch<React.SetStateAction<Map<any, any>>>;
  setData: React.Dispatch<
    React.SetStateAction<
      {
        id: string;
        label: string;
      }[]
    >
  >;
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
    // Calculate new translateY values for all items based on the new index of the dragged item
    // Create a shallow copy of the itemLayoutProps to manipulate
    const updatedLayoutProps = { ...itemLayoutProps };

    // Calculate new translateY values for all items based on the new index of the dragged item
    const sortedItems = Object.keys(updatedLayoutProps).sort(
      (a, b) => updatedLayoutProps[a].pageY - updatedLayoutProps[b].pageY,
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
      const itemProps = itemLayoutProps[itemId];
      accumulatedHeight += itemProps.height + 10;
    });

    setItemPositions(newItemPositions);
  };

  const moveHandler = (newPosition: number) => {
    translateY.value = newPosition + itemPositions.get(item.id).originalY;

    const orderedItemIds = [...itemPositions.keys()].sort(
      (a, b) => itemPositions.get(a).positionY - itemPositions.get(b).positionY,
    );

    const currentIndex = orderedItemIds.indexOf(item.id);

    let newIndex = currentIndex;

    for (let i = 0; i < orderedItemIds.length; i++) {
      const itemId = orderedItemIds[i];
      if (itemId === item.id) {
        continue;
      }

      const itemPosition = itemPositions.get(itemId).positionY;
      const itemHeight = itemLayoutProps[itemId].height;
      const dragPosition =
        translateY.value + itemLayoutProps[item.id].height / 2;

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
    const sortedPositions = Array.from(itemPositions.entries())
      .sort((a, b) => a[0].sortOrder - b[0].sortOrder)
      .map(([key]) => ({ id: key, label: key }));
    setData(sortedPositions);
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
      setItemLayoutProps(layoutProps => {
        if (layoutProps[item.id]) {
          return layoutProps;
        }
        const newLayoutProps = {
          ...layoutProps,
          [item.id]: { pageX, pageY, height, translateY: 0 },
        };
        return newLayoutProps;
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
