import React, { useMemo, useState } from 'react';
import { RouteProp, useRoute } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { ReducerProps } from 'src/services';
import { getGoalStatus } from '../helpers';
import { ScrollView } from 'react-native';
import GoalFilterItem from './GoalFilteredItem';
import { FlexBox } from '@app/ui';
import GoalProfile from './GoalProfile';
import { HomeStackParamsList } from 'src/screens/home/types';
import { GoalTypes } from 'src/services/goals/types';

type Props = {
  activeFilter: string;
};

const GoalList: React.FC<Props> = ({ activeFilter }) => {
  const [activeGoal, setActiveGoal] = useState<string>();
  const {
    params: { type, exercise },
  } = useRoute<RouteProp<HomeStackParamsList, 'Goals'>>();
  const goals = useSelector((state: ReducerProps) => {
    return state.goals.user[
      type === GoalTypes.endurance ? 'endurances' : 'exercises'
    ].map(goal => ({
      ...goal,
      ...getGoalStatus(goal),
    }));
  });
  const exerciseGoals = useMemo(() => {
    const isExercise = type === GoalTypes.exercise;
    if (isExercise && !exercise) return [];
    return goals
      .filter(goal => {
        if (isExercise) {
          if (goal.exerciseUid !== exercise?._id) return false;
        }
        if (activeFilter === 'all') return true;
        if (goal.status === activeFilter) return true;
      })
      .sort(
        (a, b) =>
          new Date(b.startDate).getTime() - new Date(a.startDate).getTime(),
      );
  }, [exercise, goals, activeFilter]);

  const goalProfile = exerciseGoals.find(goal => goal._id === activeGoal);

  return (
    <React.Fragment>
      <FlexBox>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {exerciseGoals.map((goal, i) => {
            return (
              <GoalFilterItem
                key={goal._id || i}
                goal={goal}
                active={goal._id === activeGoal}
                onPress={() => setActiveGoal(goal._id)}
              />
            );
          })}
        </ScrollView>
      </FlexBox>
      {goalProfile && exercise && (
        <GoalProfile goal={goalProfile} exercise={exercise} />
      )}
    </React.Fragment>
  );
};

export default GoalList;
