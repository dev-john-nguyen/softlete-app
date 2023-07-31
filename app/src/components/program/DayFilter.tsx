import React, { useCallback } from 'react';
import { FlatList } from 'react-native';
import Constants from '../../utils/Constants';
import BaseColors, { rgba } from '../../utils/BaseColors';
import PrimaryText from '../elements/PrimaryText';
import { FlexBox } from '@app/ui';
import { WorkoutByWeekProps } from 'src/services/program/types';
import { Colors } from '@app/utils';

const { daysOfWeek } = Constants;

const daysShort = daysOfWeek.map((d: string) => d.substring(0, 3));

interface Props {
  curDay: number;
  onChangeCurDay: (day: number) => void;
  onLongPress?: (day: number) => void;
  groupByDay?: any;
  workouts: WorkoutByWeekProps[][];
}

const DayFilter = ({
  curDay,
  onChangeCurDay,
  onLongPress,
  groupByDay,
  workouts,
}: Props) => {
  const renderItem = useCallback(
    ({ item, index }: { item: string; index: number }) => {
      const hasWos = (workouts[index]?.length ?? 0) > 0;

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
          {hasWos && (
            <FlexBox
              height={5}
              width={5}
              borderRadius={100}
              backgroundColor={Colors.white}
              position="absolute"
              top={0}
              right={0}
            />
          )}
        </FlexBox>
      );
    },
    [curDay, onChangeCurDay, onLongPress, workouts],
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
