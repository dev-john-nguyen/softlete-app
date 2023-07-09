import { GraphPlaceholder, PrimaryText } from '@app/elements';
import { FlexBox } from '@app/ui';
import { Colors, moderateScale, normalize, rgba } from '@app/utils';
import React, { FC, Fragment, useMemo } from 'react';
import { LayoutChangeEvent } from 'react-native';
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
  chartBannerElement?: JSX.Element | JSX.Element[];
  bannerLabel?: string;
  isBannerVisible?: boolean;
  bannerValue?: string | number;
  autoLayoutWidth?: boolean;
  autoLayoutHeight?: boolean;
  applyHeaderPadding?: boolean;
  getDotProps?: (value: any, index: number) => object;
}

export const defaultDotProps = {
  r: '.5',
  strokeWidth: '10',
  stroke: Colors.white,
};

export function formatNumber(numStr: string): string {
  const num = parseFloat(numStr);
  if (num >= 1000000) {
    const formattedNum = (num / 1000000).toFixed(1);
    return formattedNum.endsWith('.0')
      ? formattedNum.replace('.0', '') + 'M'
      : formattedNum + 'M';
  } else if (num > 1000) {
    const formattedNum = (num / 1000).toFixed(1);
    return formattedNum.endsWith('.0')
      ? formattedNum.replace('.0', '') + 'K'
      : formattedNum + 'K';
  } else if (num >= 1) {
    return Math.floor(num).toString();
  } else if (num > 0 && num < 1) {
    return num.toFixed(2);
  } else {
    return num.toString();
  }
}

export const LineChartGraph: FC<Props> = ({
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
  bannerLabel,
  bannerValue,
  isBannerVisible,
  autoLayoutHeight,
  autoLayoutWidth,
  applyHeaderPadding,
  getDotProps,
}) => {
  const [bannerHeight, setBannerHeight] = React.useState(0);
  const [chartLayout, setChartLayout] = React.useState<{
    width: number;
    height: number;
  }>();

  const chartPaddingRight = useMemo(() => {
    if (paddingRight) return paddingRight;
    const max = Math.max.apply(null, data);
    if (max) {
      return max.toString().length * 10;
    } else {
      return 30;
    }
  }, [data]);

  const getChartLayoutHandler = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    setChartLayout({ width, height });
  };

  return (
    <FlexBox column onLayout={getChartLayoutHandler}>
      {(header || subHeader) && (
        <FlexBox
          justifyContent="space-between"
          marginBottom={5}
          width="100%"
          paddingLeft={applyHeaderPadding ? 15 : 0}
          paddingRight={applyHeaderPadding ? 15 : 0}>
          <FlexBox column>
            <PrimaryText size="medium" bold>
              {header}
            </PrimaryText>
            {subHeader && (
              <PrimaryText size="small" opacity={0.6}>
                {subHeader}
              </PrimaryText>
            )}
          </FlexBox>
        </FlexBox>
      )}
      {data.length < 1 ? (
        <FlexBox
          height={height}
          marginTop={10}
          marginBottom={20}
          alignItems="center"
          justifyContent="center"
          width="100%"
          paddingLeft={applyHeaderPadding ? 15 : 0}
          paddingRight={applyHeaderPadding ? 15 : 0}>
          <GraphPlaceholder />
        </FlexBox>
      ) : (
        <Fragment>
          {isBannerVisible && (
            <FlexBox
              onLayoutExtract={({ height }: { height: number }) =>
                setBannerHeight(height)
              }
              padding={5}
              paddingLeft={15}
              paddingRight={15}
              borderColor={rgba(Colors.whiteRbg, 0.5)}
              borderWidth={1}
              borderRadius={5}
              alignSelf="center">
              <PrimaryText>{bannerLabel}: </PrimaryText>
              <PrimaryText>{bannerValue}</PrimaryText>
            </FlexBox>
          )}
          {chartLayout && (
            <LineChart
              data={{
                labels: labels,
                datasets: [
                  {
                    data: data,
                  },
                ],
              }}
              width={autoLayoutWidth ? chartLayout.width : width}
              height={
                (autoLayoutHeight ? chartLayout?.height : height) - bannerHeight
              }
              withVerticalLines={false}
              bezier
              formatYLabel={formatYLabel}
              segments={4}
              onDataPointClick={onDataPointClick}
              fromZero={fromZero}
              renderDotContent={renderDotContent}
              withDots={widthDots}
              getDotProps={getDotProps}
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
                propsForDots: defaultDotProps,
                strokeWidth: 1,
              }}
              style={{
                paddingRight: moderateScale(chartPaddingRight),
                overflow: 'visible',
              }}
            />
          )}
        </Fragment>
      )}
    </FlexBox>
  );
};
