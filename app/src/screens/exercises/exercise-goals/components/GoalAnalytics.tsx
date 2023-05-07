import { PrimaryText, InfoListBox } from '@app/elements';
import Icon from '@app/icons';
import { FlexBox } from '@app/ui';
import { Colors, DateTools } from '@app/utils';
import { useNavigation } from '@react-navigation/native';
import React, { FC } from 'react';
import { ScrollView } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { HomeStackScreens } from 'src/screens/home/types';
import { ReducerProps } from 'src/services';
import { ExerciseGoalProps } from 'src/services/goals/types';
import { setViewWorkout } from 'src/services/workout/actions';
import { WorkoutExerciseProps } from 'src/services/workout/types';

const GoalAnalytics: FC<{
  item: WorkoutExerciseProps;
  goal: ExerciseGoalProps;
}> = ({ goal, item }) => {
  const navigation = useNavigation<any>();
  const dispatch = useDispatch();
  const reducerState = useSelector((state: ReducerProps) => state);

  const onNavigateToWorkout = async () => {
    if (!item.workoutUid) return;
    try {
      await setViewWorkout(item.workoutUid)(dispatch, () => reducerState);
      navigation.push(HomeStackScreens.Workout);
    } catch (err) {
      console.log(err);
    }
  };

  const date = DateTools.convertUTCStrToLocalStr(
    item.date as string,
    '/',
    'd',
    false,
  );

  return (
    <FlexBox key={item._id || date} alignItems="center">
      <FlexBox
        column
        alignItems="center"
        marginRight={10}
        opacity={0.8}
        onPress={onNavigateToWorkout}>
        <Icon size={20} icon="calendar" color={Colors.white} />
        <PrimaryText variant="primary" size="small">
          {date}
        </PrimaryText>
      </FlexBox>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        nestedScrollEnabled
        style={{ marginBottom: 10 }}>
        {item.data.map((data, set) => {
          if ((data.performVal ?? 0) > goal.goal) {
            const label = set + 1 + ' x ' + data.reps;
            return (
              <InfoListBox
                key={data._id || label}
                secondary
                label={label}
                desc={(data.performVal ?? 0).toString()}
              />
            );
          }
        })}
      </ScrollView>
    </FlexBox>
  );
};

export default GoalAnalytics;
