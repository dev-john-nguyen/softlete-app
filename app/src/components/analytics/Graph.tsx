import React, { useEffect, useMemo, useState } from 'react';
import { LayoutChangeEvent } from 'react-native';
import Empty from './Empty';
import { FlexBox } from '@app/ui';
import _ from 'lodash';
import { Constants } from '@app/utils';
import { ChartBanner, LineChartGraph, PickerButton } from '@app/elements';
import { AnalyticDataProps, AnalyticsFilters } from './types';

interface CustomLineChartProps {
  data: number[];
  dates: Date[];
  chartLayout: {
    width: number;
    height: number;
  };
}

const CustomLineChart = ({
  data,
  dates,
  chartLayout,
}: CustomLineChartProps) => {
  const [activeDot, setActiveDot] = useState<number | undefined>();

  useEffect(() => {
    if (data.length > 0) {
      setActiveDot(data.length > 3 ? data.length - 1 : undefined);
    }
  }, [data]);

  const { months, values } = useMemo(() => {
    if (data.length > 0) {
      const m = _.unionWith(dates, (a, b) => {
        return a.getMonth() === b.getMonth();
      }).map(m => Constants.months[m.getMonth()].slice(0, 3));
      return { months: m, values: data };
    }
    return { months: [], values: [] };
  }, [data]);

  return (
    <LineChartGraph
      data={values}
      labels={months}
      renderDotContent={props => (
        <ChartBanner
          key={props.index}
          props={props}
          isActive={activeDot === props.index}
          data={dates}
          direction="bottom"
        />
      )}
      onDataPointClick={props => setActiveDot(props.index)}
      fromZero
      widthDots
      {...chartLayout}
    />
  );
};

interface Props {
  data: AnalyticDataProps[];
  dates: Date[];
}

const AnalyticsGraph = ({ dates, data }: Props) => {
  const [filter, setFilter] = useState<AnalyticsFilters>(AnalyticsFilters.AVG);
  const [chartLayout, setChartLayout] = useState<{
    width: number;
    height: number;
  }>();

  const filteredData = useMemo(() => {
    switch (filter) {
      case AnalyticsFilters.LOW:
        return data.map(d => d.min);
      case AnalyticsFilters.HIGH:
        return data.map(d => d.max);
      case AnalyticsFilters.AVG:
      default:
        return data.map(d => d.avg);
    }
  }, [filter, data]);

  const getChartLayoutHandler = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    setChartLayout({ width, height });
  };

  return (
    <FlexBox flex={1} padding={15} paddingTop={0} column>
      <FlexBox marginBottom={10}>
        <PickerButton
          marginBottom={0}
          isActive={filter === AnalyticsFilters.LOW}
          onPress={() => setFilter(AnalyticsFilters.LOW)}>
          Min
        </PickerButton>
        <PickerButton
          marginBottom={0}
          containerStyles={{ marginLeft: 10 }}
          isActive={filter === AnalyticsFilters.AVG}
          onPress={() => setFilter(AnalyticsFilters.AVG)}>
          Avg
        </PickerButton>
        <PickerButton
          marginBottom={0}
          containerStyles={{ marginLeft: 10 }}
          isActive={filter === AnalyticsFilters.HIGH}
          onPress={() => setFilter(AnalyticsFilters.HIGH)}>
          Max
        </PickerButton>
      </FlexBox>
      <FlexBox flex={1} onLayout={getChartLayoutHandler}>
        {data.length > 0 && chartLayout ? (
          <CustomLineChart
            data={filteredData}
            dates={dates}
            chartLayout={chartLayout}
          />
        ) : (
          <Empty />
        )}
      </FlexBox>
    </FlexBox>
  );
};

export default AnalyticsGraph;
