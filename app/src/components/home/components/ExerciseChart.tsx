import { GraphPlaceholder } from '@app/elements';
import { FlexBox } from '@app/ui';
import { moderateScale } from '@app/utils';
import unionWith from 'lodash/unionWith';
import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import BaseColors from '../../../utils/BaseColors';
import Constants from '../../../utils/Constants';
import Fonts from '../../../utils/Fonts';
import { normalize } from '../../../utils/tools';
import ExerciseChartItem from './ExerciseChartItem';

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

  if (values.length < 4)
    return (
      <FlexBox height={150} marginTop={20}>
        <GraphPlaceholder />
      </FlexBox>
    );

  return (
    <View>
      <LineChart
        data={{
          labels: months.map(m => m.toUpperCase()),
          datasets: [
            {
              data: values,
            },
          ],
        }}
        width={normalize.width(1) - moderateScale(20) * 2}
        height={normalize.height(4)}
        withVerticalLabels={true}
        withVerticalLines={false}
        segments={4}
        bezier
        renderDotContent={props => (
          <ExerciseChartItem
            key={props.index}
            props={props}
            isActive={activeDot === props.index}
            data={data}
          />
        )}
        onDataPointClick={props => setActiveDot(props.index)}
        chartConfig={{
          backgroundGradientFrom: 'transparent',
          backgroundGradientTo: 'transparent',
          backgroundGradientFromOpacity: 0,
          backgroundGradientToOpacity: 0,
          decimalPlaces: 0, // optional, defaults to 2dp
          color: () => `rgba(${BaseColors.whiteRbg}, ${0.5})`,
          labelColor: () => `rgba(${BaseColors.whiteRbg}, ${0.5})`,
          style: {
            backgroundColor: 'transparent',
          },
          propsForLabels: {
            fontSize: 12,
            fontFamily: Fonts.secondaryBold,
          },
          propsForDots: {
            r: '.5',
            strokeWidth: '6',
            stroke: BaseColors.white,
          },
          strokeWidth: 2,
        }}
        style={{
          marginTop: 5,
          paddingRight: moderateScale(30),
        }}
      />
    </View>
  );
};

export default ExerciseChart;
