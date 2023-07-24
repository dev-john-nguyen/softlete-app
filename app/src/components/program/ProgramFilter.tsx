import React from 'react';
import WeekFilter from './WeekFilter';
import DayFilter from './DayFilter';
import { GroupByDayProps } from '../../services/program/types';
import { Colors } from '@app/utils';
import Icon from '@app/icons';
import { FlexBox } from '@app/ui';

interface Props {
  weeks: string[];
  curWeek: number;
  setCurWeek: React.Dispatch<React.SetStateAction<number>>;
  curDay: number;
  onChangeCurDay: (day: number) => void;
  onDayLongPress?: (day: number) => void;
  groupByDay?: GroupByDayProps;
  athlete?: boolean;
}

const ProgramFilter = ({
  weeks,
  curWeek,
  setCurWeek,
  curDay,
  onChangeCurDay,
  onDayLongPress,
  groupByDay,
  athlete,
}: Props) => {
  return (
    <FlexBox column marginBottom={10} paddingLeft={15} paddingRight={15}>
      <FlexBox alignItems="center">
        <Icon size={20} icon="calendar" color={Colors.white} />
        <WeekFilter weeks={weeks} curWeek={curWeek} setCurWeek={setCurWeek} />
      </FlexBox>
      <FlexBox column marginTop={15}>
        <DayFilter
          curDay={curDay}
          onChangeCurDay={onChangeCurDay}
          onLongPress={onDayLongPress}
          groupByDay={groupByDay}
        />
      </FlexBox>
    </FlexBox>
  );
};

export default ProgramFilter;
