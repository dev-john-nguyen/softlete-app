import { PickerButton, ScreenTemplate } from '@app/elements';
import Icon from '@app/icons';
import { FlexBox } from '@app/ui';
import { Colors, DateTools } from '@app/utils';
import React, { useState } from 'react';
import { DateSelection } from 'src/components/analytics';
import {
  DateSelectionTypes,
  SelectedDateProps,
} from 'src/components/analytics/types';
import {
  EnduranceOptions,
  EnduranceFilterOptions,
  EnduranceFilterValues,
} from '../types';
import { useMutateEnduranceAnalytics } from '../hook';
import AnalyticsVisuals from './AnalyticsVisuals';
import useBanner from 'src/hooks/utils/useBanner';
import { useNavigation } from '@react-navigation/native';
import { HomeStackParamsList, HomeStackScreens } from '../../types';
import { StackNavigationProp } from '@react-navigation/stack';
import { GoalTypes } from 'src/services/goals/types';

enum ActivePickers {
  EnduranceType,
  FilterType,
}

const EnduranceAnalytics = () => {
  const navigation = useNavigation<StackNavigationProp<HomeStackParamsList>>();
  const [enduranceType, setEnduranceType] = useState('');
  const [filterType, setFilterType] = useState<EnduranceFilterValues>(
    EnduranceFilterValues.distance,
  );
  const [activePickerType, setActivePickerType] = useState<ActivePickers>();
  const { data, isLoading, mutateAsync } = useMutateEnduranceAnalytics();
  const setBanner = useBanner();

  const onDatesSubmission = (
    selectionType: DateSelectionTypes,
    dateFilters: SelectedDateProps[],
  ) => {
    if (!enduranceType) {
      return setBanner('Please select an endurance type!');
    }
    const dates = dateFilters.map(d => DateTools.dateToStr(d.date));
    const payload = {
      dates,
      enduranceType,
      dateFilterType: selectionType,
    };
    mutateAsync(payload);
  };

  const onNavToGoals = () => {
    navigation.navigate(HomeStackScreens.Goals, { type: GoalTypes.endurance });
  };

  const pickerOptions =
    activePickerType === ActivePickers.EnduranceType
      ? EnduranceOptions
      : EnduranceFilterOptions;

  return (
    <ScreenTemplate
      isBackVisible
      pickerOptions={pickerOptions}
      isPickerOpen={activePickerType !== undefined}
      onPickerClose={() => setActivePickerType(undefined)}
      pickerValue={
        activePickerType === ActivePickers.EnduranceType
          ? enduranceType
          : filterType
      }
      onPickerChangeValue={value => {
        if (activePickerType === ActivePickers.EnduranceType) {
          setEnduranceType(value);
        } else {
          setFilterType(value as EnduranceFilterValues);
        }
      }}
      rotateBack="-90deg"
      headerTitleFormatted="Endurance"
      rightContent={
        <FlexBox alignItems="center" justifyContent="flex-end" flex={1}>
          <Icon
            icon="target"
            color={Colors.white}
            size={20}
            onPress={onNavToGoals}
          />
        </FlexBox>
      }>
      <FlexBox column marginRight={15} marginLeft={15}>
        <PickerButton
          valueOpacity={enduranceType ? 1 : 0.5}
          marginBottom={5}
          containerStyles={{ marginTop: 10 }}
          arrow
          arrowDirection="down"
          onPress={() => setActivePickerType(ActivePickers.EnduranceType)}>
          {enduranceType
            ? EnduranceOptions.find(o => o.value === enduranceType)?.label
            : 'Select Endurance Type'}
        </PickerButton>
        <DateSelection
          onDatesSubmission={onDatesSubmission}
          isFetching={isLoading}
        />
        <PickerButton
          valueOpacity={filterType ? 1 : 0.5}
          marginBottom={0}
          containerStyles={{ marginTop: 20 }}
          arrow
          arrowDirection="down"
          onPress={() => setActivePickerType(ActivePickers.FilterType)}>
          {filterType
            ? EnduranceFilterOptions.find(o => o.value === filterType)?.label
            : 'Select Filter Type'}
        </PickerButton>
      </FlexBox>
      <AnalyticsVisuals
        data={data}
        filterType={filterType}
        isFetching={isLoading}
      />
    </ScreenTemplate>
  );
};

export default EnduranceAnalytics;
