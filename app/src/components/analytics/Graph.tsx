import React, { useEffect, useMemo, useState } from 'react';
import { LayoutChangeEvent } from 'react-native';
import Empty from './Empty';
import { FlexBox } from '@app/ui';
import _ from 'lodash';
import { Constants } from '@app/utils';
import { ChartBanner, LineChartGraph } from '@app/elements';

interface CustomLineChartProps {
  data: any;
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
  data: any;
  dates: Date[];
}

const AnalyticsGraph = ({ dates, data }: Props) => {
  const [chartLayout, setChartLayout] = useState<{
    width: number;
    height: number;
  }>();

  const getChartLayoutHandler = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    setChartLayout({ width, height });
  };

  return (
    <FlexBox flex={1} padding={15}>
      <FlexBox flex={1} onLayout={getChartLayoutHandler}>
        {data.length > 0 && chartLayout ? (
          <CustomLineChart
            data={data}
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
