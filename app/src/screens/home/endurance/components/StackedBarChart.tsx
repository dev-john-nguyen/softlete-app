import { PrimaryText } from '@app/elements';
import { FlexBox } from '@app/ui';
import { Colors, DateTools, StyleConstants, rgba } from '@app/utils';
import React, { FC, useMemo } from 'react';
import { ScrollView } from 'react-native';
import Empty from 'src/components/analytics/Empty';
import { AnalyticalDataProps } from 'src/services/misc/types';
import { HealthDataProps } from 'src/services/workout/types';
import { EnduranceFilterValues } from '../types';
import WorkoutTracker from 'src/classes/WorkoutTracker';

type Props = {
  data: AnalyticalDataProps<HealthDataProps>[];
  filterType: EnduranceFilterValues;
};

const StackedBarChart: FC<Props> = ({ data: dataProp, filterType }) => {
  const { data, largestNum } = useMemo(() => {
    let largestNum = 0;
    const largestNumHandler = (num: number) => {
      if (num > largestNum) {
        largestNum = num;
      }
    };
    const data = dataProp.map(d => {
      const healthWorkout = new WorkoutTracker(d.data.workoutUid);
      healthWorkout.initializeHealthData(d.data);
      const formatted = healthWorkout.getFormattedData();
      let value = d.data.duration;
      let valueStr = formatted?.duration;

      switch (filterType) {
        case EnduranceFilterValues.distance:
          value = d.data.distance;
          valueStr = formatted?.distance;
          break;
        case EnduranceFilterValues.duration:
          value = d.data.duration;
          valueStr = formatted?.duration;
          break;
        case EnduranceFilterValues.pace:
          value = healthWorkout.averagePaceInSec;
          valueStr = formatted?.averagePace;
          break;
      }
      largestNumHandler(value);
      return {
        date: DateTools.strToDate(d.date),
        dateFormatted: healthWorkout.getDate(undefined, undefined, false),
        value,
        valueStr,
      };
    });
    return { data, largestNum };
  }, [dataProp, filterType]);

  return (
    <FlexBox column flex={1} padding={15}>
      {data.length > 0 ? (
        <ScrollView showsVerticalScrollIndicator={false}>
          {data.map(({ dateFormatted, date, value, valueStr }) => {
            let width = Math.round((value / largestNum) * 85);
            if (value !== 0 && width < 5) width = 1;
            return (
              <FlexBox key={date.getTime()}>
                <PrimaryText
                  styles={{
                    fontSize: StyleConstants.extraSmallFont,
                  }}>
                  {dateFormatted}
                </PrimaryText>
                <FlexBox
                  width={width + '%'}
                  height="100%"
                  backgroundColor={rgba(Colors.whiteRbg, 0.4)}
                  marginLeft={5}
                  borderTopRightRadius={10}
                  borderBottomRightRadius={10}
                />
                <PrimaryText position="absolute" right={0} fontSize="small">
                  {valueStr}
                </PrimaryText>
              </FlexBox>
            );
          })}
        </ScrollView>
      ) : (
        <Empty />
      )}
    </FlexBox>
  );
};

export default StackedBarChart;
