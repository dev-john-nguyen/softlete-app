import { PickerButton, PrimaryText, ScreenTemplate } from '@app/elements';
import Icon from '@app/icons';
import { FlexBox } from '@app/ui';
import { Colors } from '@app/utils';
import React, { useState } from 'react';
import { DateSelection } from 'src/components/analytics';
import {
  DEFAULT_DATES,
  DateSelectionTypes,
  SelectedDateProps,
} from 'src/components/analytics/types';
import {
  EnduranceOptions,
  EnduranceFilterOptions,
  EnduranceFilterValues,
} from '../types';
import { useEnduranceAnalytics } from '../hook';
import AnalyticsVisuals from './AnalyticsVisuals';

enum ActivePickers {
  EnduranceType,
  FilterType,
}

const EnduranceAnalytics = () => {
  const [enduranceType, setEnduranceType] = useState('');
  const [filterType, setFilterType] = useState<EnduranceFilterValues>(
    EnduranceFilterValues.null,
  );
  const [dateFilters, setDateFilters] = useState<SelectedDateProps[]>([
    DEFAULT_DATES.start,
    DEFAULT_DATES.end,
  ]);
  const [selectionType, setSelectionType] = useState(DateSelectionTypes.range);
  const [activePickerType, setActivePickerType] = useState<ActivePickers>();
  const { data, isFetching, refetch } = useEnduranceAnalytics(
    enduranceType,
    selectionType,
    dateFilters,
  );

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
      leftContentFlex={0}
      middleContentFlex={1}
      middleContent={
        <FlexBox flex={1} marginLeft={10}>
          <PrimaryText size="large">Endurance</PrimaryText>
        </FlexBox>
      }
      rightContent={
        <FlexBox alignItems="center" justifyContent="flex-end" flex={1}>
          <Icon icon="target" color={Colors.white} size={20} />
        </FlexBox>
      }>
      <FlexBox column marginRight={15} marginLeft={15}>
        <PickerButton
          valueOpacity={enduranceType ? 1 : 0.5}
          containerStyles={{ marginTop: 10 }}
          arrow
          arrowDirection="down"
          onPress={() => setActivePickerType(ActivePickers.EnduranceType)}>
          {enduranceType
            ? EnduranceOptions.find(o => o.value === enduranceType)?.label
            : 'Select Endurance Type'}
        </PickerButton>
        <PickerButton
          valueOpacity={filterType ? 1 : 0.5}
          marginBottom={0}
          arrow
          arrowDirection="down"
          onPress={() => setActivePickerType(ActivePickers.FilterType)}>
          {filterType
            ? EnduranceFilterOptions.find(o => o.value === filterType)?.label
            : 'Select Filter Type'}
        </PickerButton>
        <DateSelection
          dateFilters={dateFilters}
          setDateFilters={setDateFilters}
          onDatesSubmission={refetch}
          selectionType={selectionType}
          setSelectionType={setSelectionType}
          isFetching={false}
        />
      </FlexBox>
      <AnalyticsVisuals data={data} filterType={filterType} />
    </ScreenTemplate>
  );
};

export default EnduranceAnalytics;
