import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { LineChart } from 'react-native-chart-kit';
import { GraphPlaceholder } from '@app/elements';
import GraphItem from './GraphItem';
import { Colors, Constants, normalize } from '@app/utils';

interface Props {
  data: number[];
  dates: Date[];
}

const CustomLineChart = ({ data, dates }: Props) => {
  const [activeDot, setActiveDot] = useState<number | undefined>();
  const [months, setMonths] = useState<string[]>([]);
  const [values, setValues] = useState<number[]>([]);

  useEffect(() => {
    if (data.length > 0) {
      const m = _.unionWith(dates, (a, b) => {
        return a.getMonth() === b.getMonth();
      }).map(m => Constants.months[m.getMonth()].slice(0, 3));
      setValues(data);
      setMonths(m);
      setActiveDot(data.length > 3 ? data.length - 1 : undefined);
    } else {
      setMonths([]);
      setValues([]);
    }
  }, [data]);

  if (values.length < 3) return <GraphPlaceholder />;

  return (
    <LineChart
      data={{
        labels: months,
        datasets: [
          {
            data: values,
          },
        ],
      }}
      width={normalize.width(1)}
      height={normalize.height(2.2)}
      renderDotContent={props => (
        <GraphItem
          key={props.index}
          props={props}
          isActive={activeDot === props.index}
          dates={dates}
        />
      )}
      onDataPointClick={props => setActiveDot(props.index)}
      bezier
      fromZero
      chartConfig={{
        backgroundGradientFromOpacity: 0,
        backgroundGradientToOpacity: 0,
        decimalPlaces: 0, // optional, defaults to 2dp
        color: (opacity = 1) => `rgba(${Colors.whiteRbg}, ${opacity})`,
        labelColor: (opacity = 1) => Colors.white,
        style: {
          borderRadius: 16,
        },
        propsForDots: {
          r: '.5',
          strokeWidth: '5',
          stroke: Colors.white,
        },
      }}
      style={{
        marginVertical: 8,
        right: 10,
      }}
    />
  );
};

export default CustomLineChart;
