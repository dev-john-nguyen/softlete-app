import React, { useState } from 'react';
import { StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import Icon from '@app/icons';
import { FlexBox } from '@app/ui';
import { Colors, rgba } from '@app/utils';
import DatePicker from 'react-native-date-picker';
import DateTools from '../../utils/DateTools';
import CircleAdd from '../elements/CircleAdd';
import Loading from '../elements/Loading';
import PrimaryButton from '../elements/PrimaryButton';
import StyleConstants, { moderateScale } from '../tools/StyleConstants';
import {
  DateSelectionTypes,
  DEFAULT_DATES,
  genNewDate,
  SelectedDateProps,
} from './types';

interface Props {
  dateFilters: SelectedDateProps[];
  setDateFilters: React.Dispatch<React.SetStateAction<SelectedDateProps[]>>;
  selectionType: DateSelectionTypes;
  setSelectionType: React.Dispatch<React.SetStateAction<DateSelectionTypes>>;
  onDatesSubmission: () => void;
  isFetching: boolean;
}

//date selection option to choose a range or multiple dates
const DateSelection = ({
  dateFilters,
  setDateFilters,
  selectionType,
  setSelectionType,
  onDatesSubmission,
  isFetching,
}: Props) => {
  const [activeDate, setActiveDate] = useState<SelectedDateProps>();
  const [isOpen, setIsOpen] = useState(false);

  const onAddDate = () => setDateFilters(d => [...d, genNewDate()]);

  const onDatePickerConfirm = (date: Date) => {
    setIsOpen(false);
    if (!activeDate) return;
    setDateFilters(dates => {
      const targetIndex = dates.findIndex(d => d.key === activeDate.key);
      if (targetIndex > -1) {
        dates[targetIndex] = { ...activeDate, date };
      }
      return [...dates];
    });
    setActiveDate(undefined);
  };

  const onRangePress = () => {
    //when switching to range always ensure that there are two dates
    setSelectionType(DateSelectionTypes.range);
    setDateFilters([DEFAULT_DATES.start, DEFAULT_DATES.end]);
  };

  const onMutliplePress = () => {
    setSelectionType(DateSelectionTypes.multiple);
  };

  const onRemoveDate =
    ({ d }: { d: SelectedDateProps }) =>
    () => {
      setDateFilters(dates => {
        if (dates.length < 2) return dates;
        const index = dates.findIndex(dt => dt.key === d.key);
        if (index > -1) {
          dates.splice(index, 1);
        }
        return [...dates];
      });
    };

  return (
    <FlexBox column marginTop={10}>
      <FlexBox marginBottom={10}>
        <PrimaryButton
          onPress={onRangePress}
          marginRight={10}
          opacity={DateSelectionTypes.range === selectionType ? 1 : 0.2}>
          Range
        </PrimaryButton>
        <PrimaryButton
          onPress={onMutliplePress}
          opacity={DateSelectionTypes.multiple === selectionType ? 1 : 0.2}>
          Multiple
        </PrimaryButton>
      </FlexBox>
      <FlexBox alignItems="center">
        <FlexBox
          marginRight={10}
          alignItems="center"
          borderRadius={100}
          borderColor={Colors.white}
          borderWidth={1}
          padding={9}>
          {isFetching ? (
            <ActivityIndicator size="small" color={Colors.white} />
          ) : (
            <Icon
              icon="search"
              size={15}
              color={Colors.white}
              onPress={onDatesSubmission}
            />
          )}
        </FlexBox>
        <FlexBox
          column
          borderLeftWidth={1}
          borderLeftColor={rgba(Colors.whiteRbg, 0.3)}
          paddingLeft={10}>
          {(() => {
            if (selectionType === DateSelectionTypes.range) {
              return (
                <FlexBox>
                  {dateFilters.length > 0 && (
                    <PrimaryButton
                      onPress={() => {
                        if (dateFilters.length < 1) return;
                        setIsOpen(true);
                        setActiveDate(dateFilters[0]);
                      }}
                      styles={{ fontSize: StyleConstants.extraSmallFont }}>
                      {DateTools.dateToStr(dateFilters[0].date)}
                    </PrimaryButton>
                  )}
                  <FlexBox
                    width={20}
                    height={2}
                    marginRight={10}
                    marginLeft={10}
                    backgroundColor={Colors.white}
                    alignSelf="center"
                    opacity={0.5}
                  />
                  {dateFilters.length > 1 && (
                    <PrimaryButton
                      onPress={() => {
                        if (dateFilters.length < 2) return;
                        setIsOpen(true);
                        setActiveDate(dateFilters[1]);
                      }}
                      styles={{
                        fontSize: StyleConstants.extraSmallFont,
                      }}>
                      {DateTools.dateToStr(dateFilters[1].date)}
                    </PrimaryButton>
                  )}
                </FlexBox>
              );
            }
            return (
              <ScrollView
                horizontal
                contentContainerStyle={{ paddingRight: moderateScale(20) }}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}>
                <CircleAdd
                  onPress={onAddDate}
                  style={styles.circleAdd}
                  size={15}
                />
                {dateFilters.map(d => (
                  <FlexBox column key={d.key} marginRight={10}>
                    <PrimaryButton
                      onPress={() => {
                        setIsOpen(true);
                        setActiveDate(d);
                      }}>
                      {DateTools.dateToStr(d.date)}
                    </PrimaryButton>
                    <Icon
                      icon="close"
                      size={8}
                      containerStyles={styles.close}
                      color={Colors.white}
                      onPress={onRemoveDate({ d })}
                    />
                  </FlexBox>
                ))}
              </ScrollView>
            );
          })()}
        </FlexBox>
      </FlexBox>
      <DatePicker
        modal
        mode="date"
        date={activeDate?.date || new Date()}
        onConfirm={onDatePickerConfirm}
        onCancel={() => setIsOpen(false)}
        open={isOpen}
      />
    </FlexBox>
  );
};

const styles = StyleSheet.create({
  circleAdd: {
    marginRight: 10,
    position: 'relative',
    bottom: 0,
  },
  close: {
    position: 'absolute',
    top: 0,
    right: -10,
    backgroundColor: rgba(Colors.primaryRgb, 0.8),
    borderWidth: 1,
    borderColor: Colors.white,
    borderRadius: 100,
    padding: 8,
  },
});
export default DateSelection;
