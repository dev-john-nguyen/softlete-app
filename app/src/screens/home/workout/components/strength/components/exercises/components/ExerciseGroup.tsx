import { StyleSheet, Vibration, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  runOnJS,
  withTiming,
  SharedValue,
  cancelAnimation,
  useAnimatedReaction,
  withSpring,
} from 'react-native-reanimated';
import { useRef, useState } from 'react';
import { CUSTOM_OFF_SET, ExerciseDataProps, ItemLayoutProps } from '../types';
import { objectMove } from '../helpers';
import GroupExercises from './GroupExercises';

type Props = {
  item: ExerciseDataProps;
  setItemLayoutProps: React.Dispatch<
    React.SetStateAction<Map<string, ItemLayoutProps>>
  >;
  setData: React.Dispatch<React.SetStateAction<ExerciseDataProps[]>>;
  scrollLayoutProps: ItemLayoutProps | undefined;
  scrollY: SharedValue<number>;
  scrollViewHeight: number;
  isAnItemDragging: SharedValue<boolean>;
  positions: SharedValue<any>;
};

const ExerciseGroup = ({
  item,
  setItemLayoutProps,
  setData,
  scrollLayoutProps,
  scrollY,
  scrollViewHeight,
  isAnItemDragging,
  positions,
}: Props) => {
  const translateY = useSharedValue(0);
  const [isMoving, setIsMoving] = useState(false);
  const myComponentRef = useRef() as React.MutableRefObject<View>;

  useAnimatedReaction(
    () => positions.value[item.id]?.positionY,
    (currentPosition, previousPosition) => {
      if (
        currentPosition !== undefined &&
        currentPosition !== previousPosition &&
        !isMoving
      ) {
        translateY.value = withSpring(currentPosition);
      }
    },
    [isMoving],
  );

  const finalizedPositions = () => {
    setData(data => {
      const ids = Object.keys(positions.value);
      const sortedPositions = ids.sort(
        (a, b) =>
          (positions.value[a]?.sortOrder as number) -
          (positions.value[b]?.sortOrder as number),
      );
      const sortedData: ExerciseDataProps[] = [];

      sortedPositions.forEach(id => {
        const targetData = data.find(d => d.id === id);
        if (targetData) {
          sortedData.push(targetData);
        }
      });
      return sortedData;
    });
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

    const currentIndex = orderedItemIds.indexOf(item.id);

    let newIndex = currentIndex;

    for (let i = 0; i < orderedItemIds.length; i++) {
      const itemId = orderedItemIds[i];
      if (itemId === item.id) {
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
      positions.value = objectMove(positions.value, item.id, newIndex);
    }
  };

  const gesture = Gesture.Pan()
    .minDistance(10)
    .onStart(() => {
      runOnJS(setIsMoving)(true);
      isAnItemDragging.value = true;
    })
    .onUpdate(event => {
      const scrollPageY = scrollLayoutProps?.pageY ?? 0;
      const positionY =
        scrollY.value + event.absoluteY - scrollPageY - CUSTOM_OFF_SET;
      translateY.value = positionY;
      autoScrollHandler();
      moveHandler();
    })
    .onEnd(() => {
      runOnJS(finalizedPositions)();
      runOnJS(setIsMoving)(false);
      isAnItemDragging.value = false;
      translateY.value = positions.value[item.id]?.positionY;
    });

  const animatedStyle = useAnimatedStyle(
    () => ({
      position: 'absolute',
      borderRadius: 10,
      top: translateY.value,
      zIndex: isMoving ? 100 : 1,
      backgroundColor: isMoving ? '#160303' : 'transparent',
      shadowColor: '#2C1A1A',
      shadowOffset: {
        height: 0,
        width: 0,
      },
      shadowOpacity: withSpring(isMoving ? 1 : 0),
      shadowRadius: 10,
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
        <GroupExercises item={item} />
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

export default ExerciseGroup;
