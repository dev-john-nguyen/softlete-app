import React, { useEffect, useMemo, useState } from 'react';
import { LayoutChangeEvent } from 'react-native';
import { FlexBox } from '@app/ui';
import _ from 'lodash';
import { Colors, Constants } from '@app/utils';
import { LineChartGraph, defaultDotProps } from '@app/elements';
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

  const bannerLabel = useMemo(() => {
    const dateLabel = dates[activeDot ?? 0];

    return dateLabel.getMonth() + 1 + '/' + dateLabel.getDate();
  }, [dates, activeDot]);

  return (
    <LineChartGraph
      data={values}
      labels={labels}
      formatYLabel={() => ''}
      isBannerVisible
      bannerLabel={bannerLabel}
      bannerValue={data[activeDot ?? 0]?.valueStr}
      onDataPointClick={props => setActiveDot(props.index)}
      fromZero
      widthDots
      paddingRight={10}
      getDotProps={(_, index) =>
        index === activeDot
          ? {
              ...defaultDotProps,
              r: 6,
              strokeWidth: 0,
              fill: Colors.white,
            }
          : defaultDotProps
      }
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
