import { GraphPlaceholder, PrimaryText } from '@app/elements';
import { FlexBox } from '@app/ui';
import { Colors, moderateScale, normalize, rgba } from '@app/utils';
import React, { FC, useMemo } from 'react';
import { LineChart } from 'react-native-chart-kit';
import { Dataset } from 'react-native-chart-kit/dist/HelperTypes';

export type onDataPointClickProps = {
  index: number;
  value: number;
  dataset: Dataset;
  x: number;
  y: number;
  getColor: (opacity: number) => string;
};

export type renderDotContentProps = {
  x: number;
  y: number;
  index: number;
  indexData: number;
};

interface Props {
  data: number[];
  header?: string;
  subHeader?: string;
  decimalPlaces?: number;
  labels?: string[];
  paddingRight?: number;
  onDataPointClick?: ((data: onDataPointClickProps) => void) | undefined;
  renderDotContent?: (params: renderDotContentProps) => React.ReactNode;
  fromZero?: boolean;
  widthDots?: boolean;
  height?: number;
  width?: number;
  formatYLabel?: (value: string) => string;
}

const LineChartGraph: FC<Props> = ({
  data,
  header,
  subHeader,
  decimalPlaces = 0,
  labels = [],
  paddingRight,
  onDataPointClick,
  fromZero,
  renderDotContent,
  widthDots = false,
  height = normalize.height(5),
  width = normalize.width(1),
  formatYLabel,
}) => {
  const chartPaddingRight = useMemo(() => {
    if (paddingRight) return paddingRight;
    const max = Math.max.apply(null, data);
    if (max) {
      return max.toString().length * 10;
    } else {
      return 30;
    }
  }, [data]);
  return (
    <FlexBox column>
      {(header || subHeader) && (
        <FlexBox justifyContent="space-between" marginBottom={5} width="100%">
          <FlexBox column>
            <PrimaryText size="medium" bold>
              {!!header}
            </PrimaryText>
            {subHeader && (
              <PrimaryText size="small" opacity={0.6}>
                {!!subHeader}
              </PrimaryText>
            )}
          </FlexBox>
        </FlexBox>
      )}
      {data.length < 1 ? (
        <FlexBox height={height} marginTop={10} marginBottom={20} width={width}>
          <GraphPlaceholder />
        </FlexBox>
      ) : (
        <LineChart
          data={{
            labels: labels,
            datasets: [
              {
                data: data,
              },
            ],
          }}
          width={width}
          height={height}
          withVerticalLines={false}
          bezier
          formatYLabel={formatYLabel}
          segments={4}
          onDataPointClick={onDataPointClick}
          fromZero={fromZero}
          renderDotContent={renderDotContent}
          withDots={widthDots}
          chartConfig={{
            backgroundGradientFrom: 'transparent',
            backgroundGradientTo: 'transparent',
            backgroundGradientFromOpacity: 0,
            backgroundGradientToOpacity: 0,
            decimalPlaces: decimalPlaces, // optional, defaults to 2dp
            color: () => rgba(Colors.whiteRbg, 0.5),
            labelColor: () => rgba(Colors.whiteRbg, 0.5),
            style: {},
            propsForLabels: {
              fontSize: 10,
            },
            propsForDots: {
              r: '.5',
              strokeWidth: '10',
              stroke: Colors.white,
            },
            strokeWidth: 1,
          }}
          style={{
            paddingRight: moderateScale(chartPaddingRight),
            overflow: 'visible',
          }}
        />
      )}
    </FlexBox>
  );
};

export default LineChartGraph;
