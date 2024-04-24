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
import { useRef } from 'react';
import {
  CUSTOM_OFF_SET,
  ExerciseDataProps,
  ItemLayoutProps,
  Positions,
} from '../types';
import { objectMove } from '../helpers';
import GroupExercises from './GroupExercises';
import { useDispatch } from 'react-redux';
import { ThunkAppDispatch } from 'src/services';
import { ExerciseOrderPayload, reorderExercises } from '@app/services';

type Props = {
  item: ExerciseDataProps;
  setItemLayoutProps: React.Dispatch<
    React.SetStateAction<Map<string, ItemLayoutProps>>
  >;
  data: ExerciseDataProps[];
  scrollLayoutProps: ItemLayoutProps | undefined;
  scrollY: SharedValue<number>;
  scrollViewHeight: number;
  isAnItemDragging: SharedValue<boolean>;
  positions: SharedValue<Positions>;
};

const ExerciseGroup = ({
  item,
  setItemLayoutProps,
  data,
  scrollLayoutProps,
  scrollY,
  scrollViewHeight,
  isAnItemDragging,
  positions,
}: Props) => {
  const translateY = useSharedValue(0);
  const myComponentRef = useRef() as React.MutableRefObject<View>;
  const initializedPosition = useSharedValue(false);
  const dispatch = useDispatch<ThunkAppDispatch>();
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
    const sortedData: ExerciseDataProps[] = [];

    sortedPositions.forEach(id => {
      const targetData = data.find(d => d.id === id);
      if (targetData) {
        sortedData.push(targetData);
      }
    });

    // This only updates groups
    const payloadExercises: ExerciseOrderPayload['exercises'] = {};

    sortedData.forEach((props, groupIndex) => {
      props.exercises.forEach((exercise, index) => {
        payloadExercises[exercise._id as string] = {
          group: groupIndex,
          order: index,
        };
      });
    });
    dispatch(reorderExercises({ exercises: payloadExercises }));
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
      const positionY =
        scrollY.value + event.absoluteY - scrollPageY - CUSTOM_OFF_SET;
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

  const gesture = Gesture.Simultaneous(longPress, panGesture);

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
