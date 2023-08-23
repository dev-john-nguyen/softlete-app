import { FlexBox } from '@app/ui';
import React, { useMemo } from 'react';
import { EnduranceFilterValues, HealthDataAnalytics } from '../types';
import { PaginatedHorizontalList } from '@app/elements';
import { DataTable } from 'src/components/analytics';
import { AnalyticalDataProps } from 'src/services/misc/types';
import { HealthDataProps } from 'src/services/workout/types';
import { DateTools } from '@app/utils';
import StackedBarChart from './StackedBarChart';
import { DataType } from 'src/components/analytics/types';
import WorkoutTracker from 'src/classes/WorkoutTracker';
import Graph from './Graph';

type Props = {
  data: HealthDataAnalytics[];
  filterType: EnduranceFilterValues;
  isFetching?: boolean;
};

const AnalyticsVisuals: React.FC<Props> = ({
  data: dataProp,
  filterType,
  isFetching,
}) => {
  const data: AnalyticalDataProps<HealthDataProps>[] = useMemo(() => {
    // get data
    return dataProp
      .map(d => {
        return {
          workoutExerciseUid: d._id as string,
          date: d.date,
          data: d,
        };
      })
      .sort(
        (a, b) =>
          DateTools.strToDate(b.date).getTime() -
          DateTools.strToDate(a.date).getTime(),
      );
  }, [dataProp]);

  const { graphData, largestNum } = useMemo(() => {
    let largestNum = 0;
    const largestNumHandler = (num: number) => {
      if (num > largestNum) {
        largestNum = num;
      }
    };
    const graphData = data.map(d => {
      const healthWorkout = new WorkoutTracker(d.data.workoutUid);
      healthWorkout.initializeHealthData(d.data);
      const formatted = healthWorkout.getFormattedData();
      let value = d.data.duration;
      let valueStr = formatted?.duration ?? '';

      switch (filterType) {
        case EnduranceFilterValues.distance:
          value = d.data.distance;
          valueStr = formatted?.distance ?? '';
          break;
        case EnduranceFilterValues.duration:
          value = d.data.duration;
          valueStr = formatted?.duration ?? '';
          break;
        case EnduranceFilterValues.pace:
          value = healthWorkout.averagePaceInSec;
          valueStr = formatted?.averagePace ?? '';
          break;
      }
      largestNumHandler(value);
      return {
        date: DateTools.strToDate(d.date),
        dateFormatted: healthWorkout.getDate(undefined, undefined, false),
        value,
        valueStr,
        _id: d.data._id,
      };
    });
    return { graphData, largestNum };
  }, [data, filterType]);

  return (
    <FlexBox column flex={1} marginTop={20}>
      <PaginatedHorizontalList
        isLoading={isFetching}
        childrens={[
          <StackedBarChart
            data={graphData}
            largestNum={largestNum}
            key="stack-bar-chart"
          />,
          <DataTable type={DataType.health} data={data} key="data-table" />,
          <Graph
            dates={graphData.map(d => d.date)}
            data={graphData}
            key="analytics-graph"
          />,
        ]}
        navItems={['bar_chart', 'box_table', 'box_graph']}
      />
    </FlexBox>
  );
};

export default AnalyticsVisuals;
