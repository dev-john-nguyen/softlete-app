import { PickerButton, PrimaryText, ScreenTemplate } from '@app/elements';
import { FlexBox } from '@app/ui';
import {
  useNavigation,
  useRoute,
  NavigationProp,
} from '@react-navigation/native';
import React, { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { ReducerProps } from 'src/services';
import { ExerciseProps } from 'src/services/exercises/types';
import { GoalStatus } from 'src/services/goals/types';
import GoalFilterItem from './components/GoalFilteredItem';
import { ScrollView } from 'react-native';
import GoalProfile from './components/GoalProfile';
import Icon from '@app/icons';
import { Colors } from '@app/utils';
import { HomeStackParamsList, HomeStackScreens } from 'src/screens/home/types';

const GoalStatusFilters = [
  { label: 'All', value: 'all' },
  ...Object.values(GoalStatus).map(status => ({
    label: status,
    value: status,
  })),
];

const ExerciseGoals = () => {
  const route = useRoute();
  const navigation = useNavigation<NavigationProp<HomeStackParamsList>>();
  const { exercise } = route.params as { exercise?: ExerciseProps };
  const goals = useSelector(
    (state: ReducerProps) => state.goals.user.exercises,
  );
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState(GoalStatusFilters[0].value);
  const [activeGoal, setActiveGoal] = useState<string>();

  const exerciseGoals = useMemo(() => {
    if (!exercise) return [];
    return goals.filter(goal => goal.exerciseUid === exercise._id);
  }, [exercise, goals]);

  const onNavigateToForm = () => {
    if (!exercise) return;
    navigation.navigate(HomeStackScreens.GoalFormModal, { exercise: exercise });
  };

  const goalProfile = exerciseGoals.find(goal => goal._id === activeGoal);

  return (
    <ScreenTemplate
      isBackVisible
      isPickerOpen={isPickerOpen}
      pickerOptions={GoalStatusFilters}
      onPickerClose={() => setIsPickerOpen(false)}
      onPickerChangeValue={(value: string) => setActiveFilter(value)}
      applyContentPadding
      leftContentFlex={0}
      rightContent={
        <FlexBox flex={1} justifyContent="flex-end" alignItems="flex-end">
          <Icon
            icon="add_ring"
            size={30}
            color={Colors.white}
            onPress={onNavigateToForm}
          />
        </FlexBox>
      }
      middleContent={
        <FlexBox flex={1} marginLeft={10}>
          <PrimaryText size="large" variant="primary">
            Goals
          </PrimaryText>
        </FlexBox>
      }>
      <FlexBox width="50%" column>
        <PickerButton
          icon="filter"
          onPress={() => setIsPickerOpen(true)}
          textTransform="capitalize">
          {activeFilter}
        </PickerButton>
      </FlexBox>
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
      {goalProfile && exercise?._id && (
        <GoalProfile goal={goalProfile} exerciseUid={exercise?._id} />
      )}
    </ScreenTemplate>
  );
};

export default ExerciseGoals;
