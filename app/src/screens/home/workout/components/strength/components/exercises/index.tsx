import { FlexBox } from '@app/ui';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ListRenderItemInfo } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import ExerciseGroup from './components/ExerciseGroup';
import { ItemLayoutAttributesProps } from './types';

const DATA = Array.from({ length: 5 }, (_, i) => ({
  id: `Item ${i + 1}`,
  label: `Item ${i + 1}`,
}));

const ExercisesContainer = () => {
  const [itemLayoutProps, setItemLayoutProps] = useState<{
    [id: string]: ItemLayoutAttributesProps;
  }>({});
  const [itemPositions, setItemPositions] = useState(new Map());
  const [data, setData] = useState(DATA);

  useEffect(() => {
    // Calculate new translateY values for all items based on the new index of the dragged item
    const sortedItems = Object.keys(itemLayoutProps).sort(
      (a, b) => itemLayoutProps[a].pageY - itemLayoutProps[b].pageY,
    );
    const newItemPositions = new Map();
    // Update translateY based on new order
    let accumulatedHeight = 0;
    sortedItems.forEach((itemId, index) => {
      newItemPositions.set(itemId, {
        positionY: accumulatedHeight,
        originalY: accumulatedHeight,
        sortOrder: index,
      });
      const itemProps = itemLayoutProps[itemId];
      accumulatedHeight += itemProps.height + 10;
    });

    setItemPositions(newItemPositions);
  }, [itemLayoutProps]);

  const renderItemHandler = useCallback(
    (
      props: ListRenderItemInfo<{
        id: string;
        label: string;
      }>,
    ) => {
      return (
        <ExerciseGroup
          item={props.item}
          index={props.index}
          setItemLayoutProps={setItemLayoutProps}
          itemLayoutProps={itemLayoutProps}
          itemPositions={itemPositions}
          setItemPositions={setItemPositions}
          setData={setData}
        />
      );
    },
    [itemLayoutProps, setItemLayoutProps, itemPositions],
  );

  return (
    <FlexBox flex={1}>
      <FlatList data={data} renderItem={renderItemHandler} />
    </FlexBox>
  );
};

export default ExercisesContainer;
