import { FlexBox } from '@app/ui';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ListRenderItemInfo } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import ExerciseGroup from './components/ExerciseGroup';

const DATA = Array.from({ length: 5 }, (_, i) => ({
  id: `Item ${i + 1}`,
  label: `Item ${i + 1}`,
}));

const ExercisesContainer = () => {
  const [itemLayoutProps, setItemLayoutProps] = useState(new Map());
  const [itemPositions, setItemPositions] = useState(new Map());
  const [data, setData] = useState(DATA);

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
          itemPosState.set(item.id, newLayoutProps);
        }
        const itemProps = itemLayoutProps.get(item.id);
        accumulatedHeight += itemProps.height + 10;
      });
      return new Map(itemPosState);
    });
  }, [data, itemLayoutProps]);

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
