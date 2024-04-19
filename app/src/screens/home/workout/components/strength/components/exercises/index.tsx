import { FlexBox } from '@app/ui';
import { useEffect, useMemo, useState } from 'react';
import ExerciseGroup from './components/ExerciseGroup';
import {
  ExerciseDataProps,
  GAP_BETWEEN_GROUPS,
  ItemLayoutProps,
  Positions,
} from './types';
import Animated, {
  AnimatedRef,
  scrollTo,
  useAnimatedReaction,
  useAnimatedRef,
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import { useExerciseGroupParams } from 'src/screens/home/workout/hooks/strength.hook';
import { alphabetMap } from 'src/screens/home/workout/constants';
import { AutoId, moderateScale } from '@app/utils';

const ExercisesContainer = () => {
  const { groupParams } = useExerciseGroupParams();
  const [itemLayoutProps, setItemLayoutProps] = useState<
    Map<string, ItemLayoutProps>
  >(new Map());
  const [data, setData] = useState<ExerciseDataProps[]>([]);
  const [scrollLayoutProps, setScrollLayoutProps] = useState<ItemLayoutProps>();
  const [scrollViewHeight, setScrollViewHeight] = useState(0);
  const scrollViewRef = useAnimatedRef() as AnimatedRef<Animated.ScrollView>;
  const scrollY = useSharedValue(0);
  const isAnItemDragging = useSharedValue(false);
  const positions = useSharedValue<Positions>({});
  const groupedExercises: ExerciseDataProps[] = useMemo(() => {
    const groupLetterIndexes = [...groupParams.keys()]
      .sort((a, b) => a - b)
      .map(group => {
        return {
          key: AutoId.newId(),
          id: alphabetMap.get(group) as string,
          label: alphabetMap.get(group) as string,
          exercises: groupParams.get(group)?.exercises ?? [],
          letterIndex: group,
        };
      });
    return groupLetterIndexes;
  }, [groupParams]);

  useEffect(() => {
    setItemLayoutProps(new Map());
    setData(groupedExercises);
  }, [groupedExercises]);

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

    const newPositions = {} as Positions;

    // Update translateY based on new order
    let accumulatedHeight = 0;
    data.forEach((item, index) => {
      const itemProps = itemLayoutProps.get(item.id);
      newPositions[item.id] = {
        positionY: accumulatedHeight,
        height: itemProps?.height as number,
        sortOrder: index,
      };
      accumulatedHeight += (itemProps?.height as number) + GAP_BETWEEN_GROUPS;
    });
    setScrollViewHeight(accumulatedHeight);
    positions.value = newPositions;
  }, [data, itemLayoutProps, positions]);

  const renderItemHandler = (item: ExerciseDataProps) => {
    return (
      <ExerciseGroup
        key={item.key}
        item={item}
        setItemLayoutProps={setItemLayoutProps}
        setData={setData}
        scrollLayoutProps={scrollLayoutProps}
        scrollY={scrollY}
        scrollViewHeight={scrollViewHeight}
        isAnItemDragging={isAnItemDragging}
        positions={positions}
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
          paddingLeft: moderateScale(15),
          paddingRight: moderateScale(15),
          alignItems: 'center',
        }}>
        {data.map(renderItemHandler)}
      </Animated.ScrollView>
    </FlexBox>
  );
};

export default ExercisesContainer;
