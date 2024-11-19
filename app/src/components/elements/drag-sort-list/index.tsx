import { FlexBox } from '@app/ui';
import { AutoId, moderateScale } from '@app/utils';
import { FC, useState, useEffect, useMemo } from 'react';
import Animated, {
  useSharedValue,
  useAnimatedRef,
  AnimatedRef,
  useAnimatedReaction,
  useAnimatedScrollHandler,
  scrollTo,
} from 'react-native-reanimated';
import DragAndSortItem from './components/DragAndSortItem';
import {
  ItemLayoutProps,
  Positions,
  GAP_BETWEEN_GROUPS,
  ItemProps,
} from './types';

interface Props {
  data: any[];
  renderItem: (data: ItemProps<any>) => JSX.Element;
  updateCallback: (data: ItemProps<any>[]) => void;
  gap?: number;
}

const DragAndSortList: FC<Props> = ({
  data: dataProp,
  renderItem,
  updateCallback,
  gap = GAP_BETWEEN_GROUPS,
}) => {
  const [data, setData] = useState<ItemProps<any>[]>([]);
  const [scrollViewHeight, setScrollViewHeight] = useState(0);
  const [itemLayoutProps, setItemLayoutProps] = useState<
    Map<string, ItemLayoutProps>
  >(new Map());
  const scrollY = useSharedValue(0);
  const [scrollLayoutProps, setScrollLayoutProps] = useState<ItemLayoutProps>();
  const scrollViewRef = useAnimatedRef() as AnimatedRef<Animated.ScrollView>;
  const isAnItemDragging = useSharedValue(false);
  const positions = useSharedValue<Positions>({});

  useEffect(() => {
    // resets states
    setItemLayoutProps(new Map());
    positions.value = {};
    setData(
      dataProp.map(props => {
        return {
          id: AutoId.newId(20),
          data: props,
        };
      }),
    );
  }, [dataProp, positions]);

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

    let accumulatedHeight = 0;

    data.forEach((item, index) => {
      const itemProps = itemLayoutProps.get(item.id as string);
      newPositions[item.id as string] = {
        positionY: accumulatedHeight,
        height: itemProps?.height as number,
        sortOrder: index,
      };
      accumulatedHeight += (itemProps?.height as number) + gap;
    });

    setScrollViewHeight(
      scrollViewHeight ? scrollViewHeight : accumulatedHeight,
    );
    positions.value = newPositions;
  }, [data, gap, itemLayoutProps, positions]);

  const onUpdateCallback = (ids: string[]) => {
    const newOrderItems: ItemProps<any>[] = [];
    ids.forEach(id => {
      const item = data.find(d => d.id === id);
      if (item) {
        newOrderItems.push(item);
      }
    });
    updateCallback(newOrderItems);
  };

  const renderItemHandler = (item: ItemProps<any>) => {
    return (
      <DragAndSortItem
        key={item.id}
        item={item}
        setItemLayoutProps={setItemLayoutProps}
        scrollLayoutProps={scrollLayoutProps}
        scrollY={scrollY}
        scrollViewHeight={scrollViewHeight}
        isAnItemDragging={isAnItemDragging}
        positions={positions}
        updateCallback={onUpdateCallback}
        renderItem={renderItem}
        gap={gap}
      />
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

  const items = useMemo(() => {
    return data.map(renderItemHandler);
  }, [data]);

  return (
    <FlexBox flex={1}>
      <Animated.ScrollView
        ref={scrollViewRef}
        onScroll={onScroll}
        onLayout={getLayoutMeasurements}
        scrollEventThrottle={16}
        contentContainerStyle={{
          height: isNaN(scrollViewHeight) ? 0 : scrollViewHeight,
          paddingLeft: moderateScale(15),
          paddingRight: moderateScale(15),
          alignItems: 'center',
        }}>
        {items}
      </Animated.ScrollView>
    </FlexBox>
  );
};

export default DragAndSortList;
