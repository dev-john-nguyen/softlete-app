import React, { useCallback } from 'react';
import { FlatList } from 'react-native';
import Constants from '../../utils/Constants';
import BaseColors, { rgba } from '../../utils/BaseColors';
import PrimaryText from '../elements/PrimaryText';
import { FlexBox } from '@app/ui';

const { daysOfWeek } = Constants;

const daysShort = daysOfWeek.map((d: string) => d.substring(0, 3));

interface Props {
  curDay: number;
  onChangeCurDay: (day: number) => void;
  onLongPress?: (day: number) => void;
  groupByDay?: any;
}

const DayFilter = ({
  curDay,
  onChangeCurDay,
  onLongPress,
  groupByDay,
}: Props) => {
  const renderItem = useCallback(
    ({ item, index }: { item: string; index: number }) => {
      return (
        <FlexBox
          column
          justifyContent="space-between"
          alignItems="center"
          padding={5}
          borderBottomWidth={1}
          borderBottomColor={
            curDay === index ? BaseColors.white : 'transparent'
          }
          onPress={() => onChangeCurDay(index)}
          onLongPress={() => onLongPress && onLongPress(index)}>
          <PrimaryText
            textTransform="capitalize"
            color={
              curDay === index
                ? BaseColors.white
                : rgba(BaseColors.whiteRbg, 0.2)
            }
            bold>
            {item}
          </PrimaryText>
        </FlexBox>
      );
    },
    [curDay, onChangeCurDay, onLongPress],
  );

  return (
    <FlatList
      extraData={groupByDay}
      data={daysShort}
      horizontal={true}
      contentContainerStyle={{ justifyContent: 'space-between', flexGrow: 1 }}
      keyExtractor={(item, index) => index.toString()}
      renderItem={renderItem}
    />
  );
};

export default DayFilter;
