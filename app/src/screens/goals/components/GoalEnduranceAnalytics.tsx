import React, { FC, useEffect, useMemo } from 'react';
import { GoalProps, GoalSubTypes } from 'src/services/goals/types';
import { useGoalEnduranceAnalytics } from '../hooks';
import { FlexBox } from '@app/ui';
import { ActivityIndicator, ScrollView } from 'react-native';
import { Colors } from '@app/utils';
import { setViewWorkout } from 'src/services/workout/actions';
import { HomeStackParamsList, HomeStackScreens } from 'src/screens/home/types';
import { PrimaryText, InfoListBox } from '@app/elements';
import Icon from '@app/icons';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { ReducerProps } from 'src/services';
import { RespHealthDataProps } from '../types';
import WorkoutTracker from 'src/classes/WorkoutTracker';
import { StackNavigationProp } from '@react-navigation/stack';

const Item: FC<{
  item: RespHealthDataProps;
  goal: GoalProps;
}> = ({ goal, item }) => {
  const navigation = useNavigation<StackNavigationProp<HomeStackParamsList>>();
  const dispatch = useDispatch();
  const reducerState = useSelector((state: ReducerProps) => state);

  const onNavigateToWorkout = async () => {
    if (!item.workout._id) return;
    try {
      await setViewWorkout(item.workout._id)(dispatch, () => reducerState);
      navigation.push(HomeStackScreens.Workout);
    } catch (err) {
      console.log(err);
    }
  };

  const workout = useMemo(() => {
    const workoutInstance = new WorkoutTracker(item.workout._id);
    workoutInstance.initializeHealthData(item);
    const data = workoutInstance.getFormattedData({ showYear: false });
    return data;
  }, [item]);

  const ItemElements = useMemo(() => {
    const elements = [
      {
        type: GoalSubTypes.endurance_duration,
        element: (
          <InfoListBox
            secondary
            label="Duration"
            desc={workout?.duration ?? 'n/a'}
            hasBorder={goal.subType === GoalSubTypes.endurance_duration}
            key="endurance_duration"
          />
        ),
      },
      {
        type: GoalSubTypes.endurance_avg_pace,
        element: (
          <InfoListBox
            secondary
            label="Pace (mi)"
            desc={workout?.averagePace ?? 'n/a'}
            hasBorder={goal.subType === GoalSubTypes.endurance_avg_pace}
            key="avg_pace"
          />
        ),
      },
      {
        type: GoalSubTypes.endurance_distance,
        element: (
          <InfoListBox
            secondary
            label="Distance"
            desc={workout?.distance ?? 'n/a'}
            hasBorder={goal.subType === GoalSubTypes.endurance_distance}
            key="endurance_distance"
          />
        ),
      },
    ];
    const firstItemIndex = elements.findIndex(
      ({ type }) => type === goal.subType,
    );
    if (firstItemIndex > -1) {
      const itemToMove = elements[firstItemIndex];
      elements.splice(firstItemIndex, 1);
      elements.unshift(itemToMove);
    }

    return elements.map(({ element }) => element);
  }, [goal, workout]);

  return (
    <FlexBox key={item._id} alignItems="center">
      <FlexBox
        column
        alignItems="center"
        marginRight={10}
        opacity={0.8}
        onPress={onNavigateToWorkout}>
        <Icon size={20} icon="calendar" color={Colors.white} />
        <PrimaryText variant="primary" size="small">
          {workout?.formattedDate}
        </PrimaryText>
      </FlexBox>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        nestedScrollEnabled
        style={{ marginBottom: 10 }}>
        {ItemElements}
      </ScrollView>
    </FlexBox>
  );
};

type Props = {
  goal: GoalProps;
};

const GoalEnduranceAnalytics: React.FC<Props> = ({ goal }) => {
  const { data, isFetching } = useGoalEnduranceAnalytics(goal);

  return isFetching ? (
    <FlexBox
      marginTop={20}
      alignItems="center"
      justifyContent="center"
      flex={1}>
      <ActivityIndicator size={20} color={Colors.white} />
    </FlexBox>
  ) : (
    <FlexBox marginTop={10} flex={1}>
      <ScrollView showsVerticalScrollIndicator={false} nestedScrollEnabled>
        {data.map(item => {
          return <Item key={item._id} item={item} goal={goal} />;
        })}
      </ScrollView>
    </FlexBox>
  );
};

export default GoalEnduranceAnalytics;
