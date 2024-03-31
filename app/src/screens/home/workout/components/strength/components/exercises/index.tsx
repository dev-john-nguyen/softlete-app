import { FlexBox } from '@app/ui';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ScrollView } from 'react-native';
import ExerciseGroup from './components/ExerciseGroup';
import { useWorkoutState } from 'src/screens/home/workout/contexts/Workout.context';
import { ExerciseDataProps, ItemLayoutProps, ItemPositionProps } from './types';

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
      console.log(accumulatedHeight);
      return new Map(itemPosState);
    });
  }, [data, itemLayoutProps]);

  const renderItemHandler = useCallback(
    (item: ExerciseDataProps, index: number) => {
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
        />
      );
    },
    [itemLayoutProps, setItemLayoutProps, itemPositions],
  );

  return (
    <FlexBox flex={1}>
      <ScrollView>{data.map(renderItemHandler)}</ScrollView>
    </FlexBox>
  );
};

export default ExercisesContainer;
