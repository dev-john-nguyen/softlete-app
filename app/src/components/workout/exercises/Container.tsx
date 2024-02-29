import React, { useRef, useLayoutEffect, useCallback, useContext } from 'react';
import { StyleSheet, FlatList, ViewToken } from 'react-native';
import {
  WorkoutExerciseProps,
  WorkoutExerciseDataProps,
  WorkoutActionProps,
} from '../../../services/workout/types';
import WorkoutExercise from './Exercise';
import { normalize } from '../../../utils/tools';
import { ExerciseProps } from '../../../services/exercises/types';
import { WorkoutContext } from '@app/contexts';
import { FlexBox } from '@app/ui';

interface Props {
  exercises: WorkoutExerciseProps[];
  onUpdateData: (data: WorkoutExerciseDataProps[], index: number) => void;
  onGroupSelect: (g: number) => void;
  curGroup?: number;
  navIsActive: any;
  setCurEx: React.Dispatch<
    React.SetStateAction<WorkoutExerciseProps | undefined>
  >;
  onNavigateToExercise: (exercise: ExerciseProps) => void;
  onCalcRefUpdate: (calc: number | string, index: number) => void;
  removeWorkoutExercise: WorkoutActionProps['removeWorkoutExercise'];
  navGroupState: { group: number };
}

interface InfoProps {
  viewableItems: ViewToken[];
  changed: ViewToken[];
}

const ITEM_HEIGHT = normalize.width(1);

const ExercisesContainer = ({
  exercises,
  navGroupState,
  onUpdateData,
  onGroupSelect,
  curGroup,
  navIsActive,
  setCurEx,
  onNavigateToExercise,
  onCalcRefUpdate,
  removeWorkoutExercise,
}: Props) => {
  const listRef: any = useRef();
  const lastViewableItem: any = useRef();
  const { athlete, workout } = useContext(WorkoutContext);

  const onViewableItemsChanged = useCallback(({ viewableItems }: InfoProps) => {
    for (let i = 0; i < viewableItems.length; i++) {
      const item = viewableItems[i];
      if (item.isViewable) {
        const e = item.item as WorkoutExerciseProps;
        setCurEx(e);
        onGroupSelect(e.group);
        lastViewableItem.current = item.index;
        return;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useLayoutEffect(() => {
    scrollToFirstItem(navGroupState.group);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navGroupState]);

  const scrollToFirstItem = (group: number) => {
    //navigate to the first item of that group
    if (listRef.current) {
      if (navIsActive.current) {
        if (group === -1) {
          listRef.current.scrollToOffset({ offset: 0 });
        } else if (group === -2) {
          listRef.current.scrollToEnd();
        } else {
          const scrollToIndex = exercises.findIndex(e => e.group === group);
          if (scrollToIndex > -1) {
            listRef.current.scrollToIndex({ index: scrollToIndex });
          }
        }
      }
    }
  };

  const isLastItemInGroup = (exercise: WorkoutExerciseProps) => {
    const exGroupItems = exercises.filter(e => e.group === exercise.group);
    if (exGroupItems.length < 1) return true;
    //find the largest order number in the exgroupitems
    //sort
    //descending
    const ordered = exGroupItems.sort((a, b) => b.order - a.order);
    //first item has the highest order
    if (ordered[0]._id === exercise._id) return true;

    return false;
  };

  const renderItem = useCallback(
    ({ item, index }: { item: WorkoutExerciseProps; index: number }) => (
      <WorkoutExercise
        key={item._id}
        exercise={item}
        onUpdateData={data => onExerciseUpdateData(data, index)}
        workout={workout}
        onPress={onNavigateToExercise}
        onCalcRefUpdate={calc => onCalcRefUpdate(calc, index)}
        athlete={athlete}
        removeWorkoutExercise={removeWorkoutExercise}
        showGoBack={isLastItemInGroup(item)}
        goToFirstItem={() => scrollToFirstItem(curGroup ? curGroup : 0)}
      />
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [exercises, workout, curGroup],
  );

  const onExerciseUpdateData = (
    data: WorkoutExerciseDataProps[],
    index: number,
  ) => {
    if (onUpdateData) onUpdateData(data, index);
  };

  return (
    <FlexBox flex={1}>
      <FlatList
        style={styles.container}
        ref={listRef}
        initialNumToRender={1}
        nestedScrollEnabled={true}
        data={exercises}
        onViewableItemsChanged={onViewableItemsChanged}
        keyExtractor={(item, index) => (item._id ? item._id : index.toString())}
        horizontal={true}
        pagingEnabled={true}
        getItemLayout={(data, index) => ({
          length: ITEM_HEIGHT,
          offset: ITEM_HEIGHT * index,
          index,
        })}
        onScrollToIndexFailed={info => {
          const wait = new Promise(resolve => setTimeout(resolve, 500));
          wait.then(() => {
            listRef.current?.scrollToIndex({
              index: info.index,
              animated: true,
            });
          });
        }}
        keyboardShouldPersistTaps="always"
        renderItem={renderItem}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
      />
    </FlexBox>
  );
};

const styles = StyleSheet.create({
  container: {},
  emptyContainer: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: normalize.width(1),
  },
  athletes: {
    width: normalize.width(2),
    height: normalize.width(2),
    alignSelf: 'center',
  },
});
export default ExercisesContainer;
