import { PickerButton, PrimaryText, ScreenTemplate } from '@app/elements';
import { FlexBox } from '@app/ui';
import {
  useNavigation,
  useRoute,
  NavigationProp,
  RouteProp,
} from '@react-navigation/native';
import React, { useState } from 'react';
import { GoalStatus, GoalTypes } from 'src/services/goals/types';
import Icon from '@app/icons';
import { Colors } from '@app/utils';
import { HomeStackParamsList, HomeStackScreens } from 'src/screens/home/types';
import GoalList from './GoalList';
import { ExerciseProps } from 'src/services/exercises/types';

const GoalStatusFilters = [
  { label: 'All', value: 'all' },
  ...Object.values(GoalStatus).map(status => ({
    label: status,
    value: status,
  })),
];

const Goals = () => {
  const {
    params: { exercise, type },
  } = useRoute<RouteProp<HomeStackParamsList, 'Goals'>>();
  const navigation = useNavigation<NavigationProp<HomeStackParamsList>>();
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState(GoalStatusFilters[0].value);

  const onNavigateToForm = () => {
    if (type === GoalTypes.exercise && !exercise) return;
    const payload: { type: GoalTypes; exercise?: ExerciseProps } = {
      type,
    };
    if (type === GoalTypes.exercise) {
      payload.exercise = exercise;
    }
    navigation.navigate(HomeStackScreens.GoalFormModal, payload);
  };

  return (
    <ScreenTemplate
      isBackVisible
      isPickerOpen={isPickerOpen}
      pickerOptions={GoalStatusFilters}
      onPickerClose={() => setIsPickerOpen(false)}
      onPickerChangeValue={(value: string) => setActiveFilter(value)}
      pickerValue={activeFilter}
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
      <GoalList activeFilter={activeFilter} />
    </ScreenTemplate>
  );
};

export default Goals;
