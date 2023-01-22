import { GraphPlaceholder, PrimaryText } from '@app/elements';
import { FlexBox } from '@app/ui';
import { Colors, moderateScale, normalize, rgba } from '@app/utils';
import React from 'react';
import { LineChart } from 'react-native-chart-kit';

interface Props {
  data: number[];
  dates?: string[];
  color?: string;
}

const HeartRateChart = ({ data, dates, color }: Props) => {
  return (
    <FlexBox column>
      <FlexBox justifyContent="space-between" marginBottom={5} width="100%">
        <FlexBox column>
          <PrimaryText size="medium" bold>
            Heart Rate Trend
          </PrimaryText>
          <PrimaryText size="small" opacity={0.6}>
            bpm
          </PrimaryText>
        </FlexBox>
      </FlexBox>
      {data.length < 1 ? (
        <FlexBox height={150} marginTop={10} marginBottom={20}>
          <GraphPlaceholder />
        </FlexBox>
      ) : (
        <LineChart
          data={{
            labels: dates ? dates : [],
            datasets: [
              {
                data: data.length < 2 ? [0] : data,
              },
            ],
          }}
          width={normalize.width(1)}
          height={normalize.height(5)}
          withVerticalLines={false}
          bezier
          segments={4}
          withDots={false}
          chartConfig={{
            backgroundGradientFrom: 'transparent',
            backgroundGradientTo: 'transparent',
            backgroundGradientFromOpacity: 0,
            backgroundGradientToOpacity: 0,
            decimalPlaces: 0, // optional, defaults to 2dp
            color: () => rgba(Colors.whiteRbg, 0.5),
            labelColor: () => rgba(Colors.whiteRbg, 0.5),
            style: {},
            propsForLabels: {
              fontSize: 10,
            },
            propsForDots: {
              r: '2',
              strokeWidth: '0',
              stroke: color ? color : Colors.primary,
            },
            strokeWidth: 1,
          }}
          style={{
            paddingRight: moderateScale(30),
          }}
        />
      )}
    </FlexBox>
  );
};

export default HeartRateChart;
