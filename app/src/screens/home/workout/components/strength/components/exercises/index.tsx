import { FlexBox } from '@app/ui';
import { useEffect, useMemo, useState } from 'react';
import ExerciseGroup from './components/ExerciseGroup';
import { useWorkoutState } from 'src/screens/home/workout/contexts/Workout.context';
import { ExerciseDataProps, ItemLayoutProps, ItemPositionProps } from './types';
import Animated, {
  AnimatedRef,
  scrollTo,
  useAnimatedReaction,
  useAnimatedRef,
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';

const ExercisesContainer = () => {
  const { workout } = useWorkoutState();
  const exercises = useMemo(() => {
    return workout.exercises.map(exercise => {
      return {
        id: exercise._id as string,
        label: exercise.exercise?.name ?? '',
      };
    });
  }, [workout]);
  const [itemLayoutProps, setItemLayoutProps] = useState<
    Map<string, ItemLayoutProps>
  >(new Map());
  const [itemPositions, setItemPositions] = useState<
    Map<string, ItemPositionProps>
  >(new Map());
  const [data, setData] = useState<ExerciseDataProps[]>(exercises);
  const [scrollLayoutProps, setScrollLayoutProps] = useState<ItemLayoutProps>();
  const [scrollViewHeight, setScrollViewHeight] = useState(0);
  const scrollViewRef = useAnimatedRef() as AnimatedRef<Animated.ScrollView>;
  const scrollY = useSharedValue(0);
  const isAnItemDragging = useSharedValue(false);

  useEffect(() => {
    console.log(data.map(props => props.label));
  }, [data]);

  useEffect(() => {
    // validate that all items have a height before proceeding
    if (itemLayoutProps.size !== data.length) {
      return;
    }

    for (const layoutProps of itemLayoutProps.values()) {
      if (!layoutProps.height) {
        return;
      }
    }

    setItemPositions(itemPosState => {
      // Update translateY based on new order
      let accumulatedHeight = 0;
      data.forEach((item, index) => {
        const itemPos = itemPosState.get(item.id);
        const newLayoutProps = {
          positionY: accumulatedHeight,
          originalY: accumulatedHeight,
          sortOrder: index,
        };
        if (itemPos) {
          itemPosState.set(item.id, {
            ...itemPos,
            ...newLayoutProps,
          });
        } else {
          itemPosState.set(item.id, {
            ...newLayoutProps,
            data: item,
          });
        }
        const itemProps = itemLayoutProps.get(item.id);
        accumulatedHeight += (itemProps?.height as number) + 10;
      });
      setScrollViewHeight(accumulatedHeight);
      return new Map(itemPosState);
    });
  }, [data, itemLayoutProps]);

  const renderItemHandler = (item: ExerciseDataProps, index: number) => {
    return (
      <ExerciseGroup
        key={item.id}
        item={item}
        index={index}
        setItemLayoutProps={setItemLayoutProps}
        itemLayoutProps={itemLayoutProps}
        itemPositions={itemPositions}
        setItemPositions={setItemPositions}
        setData={setData}
        scrollLayoutProps={scrollLayoutProps}
        scrollY={scrollY}
        scrollViewHeight={scrollViewHeight}
        isAnItemDragging={isAnItemDragging}
      />
    );
  };

  const getLayoutMeasurements = () => {
    (scrollViewRef.current as any).measure(
      (
        x: number,
        y: number,
        width: number,
        height: number,
        pageX: number,
        pageY: number,
      ) => {
        console.log(pageY);
        setScrollLayoutProps({
          height,
          pageX,
          pageY,
          translateY: 0,
        });
      },
    );
  };

  useAnimatedReaction(
    () => scrollY.value,
    scrolling => {
      return scrollTo(scrollViewRef, 0, scrolling, false);
    },
  );

  const onScroll = useAnimatedScrollHandler(event => {
    if (isAnItemDragging.value) {
      return; // don't update if an item is dragging
    }
    scrollY.value = event.contentOffset.y;
  });

  return (
    <FlexBox flex={1}>
      <Animated.ScrollView
        ref={scrollViewRef}
        onLayout={getLayoutMeasurements}
        onScroll={onScroll}
        scrollEventThrottle={16}
        contentContainerStyle={{
          height: scrollViewHeight,
        }}>
        {data.map(renderItemHandler)}
      </Animated.ScrollView>
    </FlexBox>
  );
};

export default ExercisesContainer;
