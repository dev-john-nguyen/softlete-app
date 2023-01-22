import React from 'react';
import _ from 'lodash';
import { FlexBox } from '@app/ui';
import { Colors, Constants } from '@app/utils';
import PrimaryText from '../elements/PrimaryText';
import Icon from '@app/icons';

const { months } = Constants;

interface Props {
  addMonth: any;
  monthProps: any;
  loading: boolean;
  offline: boolean;
  goOnline?: () => void;
}

function monthDiff(dateFrom: Date, dateTo: Date) {
  return (
    dateTo.getMonth() -
    dateFrom.getMonth() +
    12 * (dateTo.getFullYear() - dateFrom.getFullYear())
  );
}

const areEqual = (prevProps: Props, nextProps: Props) =>
  _.isEqual(prevProps, nextProps);

const CalendarHeader = ({ addMonth, monthProps, loading, offline }: Props) => {
  const arrowNext = () => !loading && addMonth(1);
  const arrowPrev = () => !loading && addMonth(-1);

  const goToThisMonth = () => {
    //find month differenct
    const thisMonth = new Date();
    const curMonth = monthProps;
    const diffTime = monthDiff(curMonth, thisMonth);
    if (diffTime === 0) return;
    addMonth(diffTime);
  };

  const currentMonth = months[monthProps.getMonth()];

  return (
    <FlexBox column>
      <FlexBox
        justifyContent="space-between"
        alignItems="center"
        width="100%"
        marginBottom={15}
        paddingLeft={10}
        paddingRight={10}>
        <FlexBox onPress={goToThisMonth}>
          <PrimaryText size="large">{currentMonth}</PrimaryText>
        </FlexBox>
        <FlexBox alignItems="center" width="20%" justifyContent="space-between">
          <Icon
            icon="chevron"
            direction="left"
            onPress={arrowPrev}
            size={15}
            color={Colors.white}
            hitSlop={10}
          />
          <Icon
            icon="chevron"
            direction="right"
            onPress={arrowNext}
            size={15}
            color={Colors.white}
            hitSlop={10}
          />
        </FlexBox>
      </FlexBox>
      <FlexBox justifyContent="space-around" marginBottom={5}>
        {Constants.daysOfWeek.map((d: string) => (
          <PrimaryText size="small" key={d} textTransform="capitalize">
            {d.slice(0, 1)}
          </PrimaryText>
        ))}
      </FlexBox>
    </FlexBox>
  );
};

export default React.memo(CalendarHeader, areEqual);
