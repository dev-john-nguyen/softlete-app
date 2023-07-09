import { GraphPlaceholder, LineChartGraph } from '@app/elements';
import { FlexBox } from '@app/ui';
import unionWith from 'lodash/unionWith';
import React, { useEffect, useState } from 'react';
import { LayoutChangeEvent } from 'react-native';
import Constants from '../../../utils/Constants';

interface Props {
  data: {
    date: Date;
    value: number;
  }[];
}

const ExerciseChart = ({ data }: Props) => {
  const [activeDot, setActiveDot] = useState<number | undefined>();
  const [months, setMonths] = useState<string[]>([]);
  const [values, setValues] = useState<number[]>([]);
  const [chartLayout, setChartLayout] = useState<{
    width: number;
    height: number;
  }>();

  useEffect(() => {
    if (data.length > 0) {
      const m = unionWith(data, (a, b) => {
        return a.date.getMonth() === b.date.getMonth();
      }).map(m => Constants.months[m.date.getMonth()].slice(0, 3));
      const vals = data.map(d => d.value);
      setValues(vals);
      setMonths(m);
      setActiveDot(data.length > 3 ? data.length - 1 : undefined);
    } else {
      setMonths([]);
      setValues([]);
    }
  }, [data]);

  const getChartLayoutHandler = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    setChartLayout({ width, height });
  };

  if (values.length < 2) {
    return (
      <FlexBox flex={1} marginTop={20} marginBottom={10}>
        <GraphPlaceholder />
      </FlexBox>
    );
  }

  return (
    <FlexBox
      column
      flex={1}
      onLayout={getChartLayoutHandler}
      marginRight={5}
      marginLeft={5}>
      {chartLayout && (
        <LineChartGraph
          data={values}
          labels={months.map(m => m.toUpperCase())}
          onDataPointClick={props => setActiveDot(props.index)}
          fromZero
          widthDots
          bannerLabel="Value"
          bannerValue={activeDot !== undefined ? values[activeDot] : undefined}
          {...chartLayout}
        />
      )}
    </FlexBox>
  );
};

export default ExerciseChart;
