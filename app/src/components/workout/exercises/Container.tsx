import React, { useRef, useLayoutEffect, useCallback } from 'react';
import { StyleSheet, FlatList, ViewToken } from 'react-native';
import {
  WorkoutExerciseProps,
  WorkoutExerciseDataProps,
  WorkoutStatus,
  WorkoutActionProps,
  ViewWorkoutProps,
  HealthDataProps,
} from '../../../services/workout/types';
import WorkoutExercise from './Exercise';
import { normalize } from '../../../utils/tools';
import { ExerciseProps } from '../../../services/exercises/types';
import { ImageProps } from '../../../services/user/types';
import AerobicContainer from '../overview/Container';
import { useDispatch } from 'react-redux';
import { updateWoHealthData } from 'src/services/workout/actions';

interface Props {
  exercises: WorkoutExerciseProps[];
  onUpdateData: (data: WorkoutExerciseDataProps[], index: number) => void;
  onGroupSelect: (g: number) => void;
  curGroup?: number;
  navIsActive: any;
  workout: ViewWorkoutProps;
  setCurEx: React.Dispatch<
    React.SetStateAction<WorkoutExerciseProps | undefined>
  >;
  onNavigateToExercise: (exercise: ExerciseProps) => void;
  onCalcRefUpdate: (calc: number | string, index: number) => void;
  removeWorkoutExercise: WorkoutActionProps['removeWorkoutExercise'];
  athlete?: boolean;
  navGroupState: { group: number };
  image?: ImageProps;
  setImage: React.Dispatch<React.SetStateAction<ImageProps | undefined>>;
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
  workout,
  setCurEx,
  onNavigateToExercise,
  athlete,
  onCalcRefUpdate,
  removeWorkoutExercise,
  image,
  setImage,
}: Props) => {
  const listRef: any = useRef();
  const lastViewableItem: any = useRef();
  const dispatch = useDispatch();

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
  }, []);

  useLayoutEffect(() => {
    scrollToFirstItem(navGroupState.group);
  }, [navGroupState]);

  const scrollToFirstItem = (group: number) => {
    //navigate to the first item of that group
    if (listRef.current) {
      if (navIsActive.current) {
        const scrollToIndex = exercises.findIndex(e => e.group === group);
        if (scrollToIndex > -1) {
          listRef.current.scrollToIndex({ index: scrollToIndex });
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

  const onUpdateWoHealthDataDispatch = async (
    workoutUid: string,
    healthData: HealthDataProps,
  ) => {
    await dispatch(updateWoHealthData(workoutUid, healthData));
  };

  const renderListFooterComponent = useCallback(() => {
    //prevent the auto save from refreshing state
    if (workout.status !== WorkoutStatus.inProgress || athlete) return <></>;
    return (
      <AerobicContainer
        image={image}
        setImage={setImage}
        workout={workout}
        updateWoHealthData={onUpdateWoHealthDataDispatch}
        athlete={athlete}
      />
    );
  }, [workout.status, athlete, image]);

  const renderListHeaderComponent = useCallback(() => {
    //prevent the auto save from refreshing state
    if (workout.status !== WorkoutStatus.completed) return <></>;
    return (
      <AerobicContainer
        image={image}
        setImage={setImage}
        workout={workout}
        updateWoHealthData={onUpdateWoHealthDataDispatch}
        athlete={athlete}
      />
    );
  }, [workout.status, athlete, image]);

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
    [exercises, workout, curGroup],
  );

  const onExerciseUpdateData = (
    data: WorkoutExerciseDataProps[],
    index: number,
  ) => {
    if (onUpdateData) onUpdateData(data, index);
  };

  return (
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
          listRef.current?.scrollToIndex({ index: info.index, animated: true });
        });
      }}
      keyboardShouldPersistTaps="always"
      ListFooterComponent={renderListFooterComponent}
      ListHeaderComponent={renderListHeaderComponent}
      renderItem={renderItem}
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
    />
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
