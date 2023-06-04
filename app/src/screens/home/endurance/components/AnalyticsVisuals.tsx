import { FlexBox } from '@app/ui';
import React, { useMemo } from 'react';
import { EnduranceFilterValues, HealthDataAnalytics } from '../types';
import { PaginatedHorizontalList } from '@app/elements';
import { DataTable, DataType } from 'src/components/analytics';
import { AnalyticalDataProps } from 'src/services/misc/types';
import { HealthDataProps } from 'src/services/workout/types';
import { DateTools } from '@app/utils';
import StackedBarChart from './StackedBarChart';

type Props = {
  data: HealthDataAnalytics[];
  filterType: EnduranceFilterValues;
};

const AnalyticsVisuals: React.FC<Props> = ({ data, filterType }) => {
  const analyticalHealthData: AnalyticalDataProps<HealthDataProps>[] =
    useMemo(() => {
      // get data
      return data
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
    }, [data]);

  return (
    <FlexBox column flex={1} marginTop={20}>
      <PaginatedHorizontalList
        childrens={[
          <StackedBarChart
            data={analyticalHealthData}
            filterType={filterType}
            key="stack-bar-chart"
          />,
          <DataTable
            type={DataType.health}
            data={analyticalHealthData}
            key="data-table"
          />,
          //   <AnalyticsGraph dates={dates} data={data} key="analytics-graph" />,
        ]}
        navItems={['bar_chart', 'box_table']}
      />
    </FlexBox>
  );
};

export default AnalyticsVisuals;
