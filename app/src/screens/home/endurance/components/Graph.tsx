import React, { useEffect, useMemo, useState } from 'react';
import { LayoutChangeEvent } from 'react-native';
import { FlexBox } from '@app/ui';
import _ from 'lodash';
import { Constants } from '@app/utils';
import { ChartBanner, LineChartGraph } from '@app/elements';
import Empty from 'src/components/analytics/Empty';

type DataProps = {
  value: number;
  valueStr: string;
};

interface CustomLineChartProps {
  data: DataProps[];
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

  const { labels, values } = useMemo(() => {
    if (data.length > 0) {
      const m = _.unionWith(dates, (a, b) => {
        return a.getMonth() === b.getMonth();
      }).map(m => Constants.months[m.getMonth()].slice(0, 3));
      return { labels: m, values: data.map(d => d.value) };
    }
    return { months: [], values: [] };
  }, [data]);

  return (
    <LineChartGraph
      data={values}
      labels={labels}
      formatYLabel={() => ''}
      renderDotContent={props => (
        <ChartBanner
          key={props.index}
          props={props}
          isActive={activeDot === props.index}
          data={dates}
          direction="bottom"
          valueStr={data[props.index]?.valueStr}
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
  data: DataProps[];
  dates: Date[];
}

const Graph = ({ dates, data }: Props) => {
  const [chartLayout, setChartLayout] = useState<{
    width: number;
    height: number;
  }>();

  const getChartLayoutHandler = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    setChartLayout({ width, height });
  };

  return (
    <FlexBox
      flex={1}
      onLayout={getChartLayoutHandler}
      marginRight={20}
      marginLeft={5}>
      {data.length > 0 && chartLayout ? (
        <CustomLineChart data={data} dates={dates} chartLayout={chartLayout} />
      ) : (
        <Empty />
      )}
    </FlexBox>
  );
};

export default Graph;
