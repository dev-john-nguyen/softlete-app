import React, { useMemo, useState } from 'react';
import { PrimaryText } from '@app/elements';
import { Colors } from '@app/utils';
import { FlexBox } from '@app/ui';
import { LayoutChangeEvent } from 'react-native';

interface Props {
  props: {
    x: number;
    y: number;
    index: number;
    indexData: number;
  };
  isActive: boolean;
  data: Date[];
  direction?: 'top' | 'bottom';
  valueStr?: string;
}

const ChartBanner = ({
  props,
  isActive,
  data,
  direction = 'top',
  valueStr,
}: Props) => {
  const [chartLayout, setChartLayout] = useState<{
    width: number;
    height: number;
  }>();

  const getChartLayoutHandler = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    setChartLayout({ width, height });
  };

  const formattedDate = useMemo(() => {
    if (data && props.index < data.length) {
      const date = data[props.index];
      if (date) {
        return date.getMonth() + 1 + '/' + date.getDate();
      }
    }
    return '';
  }, [data, props]);

  const top = (() => {
    const adjust = chartLayout?.height ?? 0;
    return direction === 'top' ? props.y - adjust : props.y;
  })();

  return (
    <FlexBox
      column
      onLayout={getChartLayoutHandler}
      position="absolute"
      zIndex={100}
      borderColor={Colors.white}
      borderWidth={1}
      padding={10}
      paddingTop={5}
      paddingBottom={5}
      borderRadius={5}
      alignItems="center"
      left={props.x}
      top={top}
      opacity={isActive ? 1 : 0}>
      <PrimaryText size="small" fontSize={10}>
        {formattedDate}
      </PrimaryText>
      <PrimaryText size="small" fontSize={10} bold>
        {valueStr ?? props.indexData}
      </PrimaryText>
    </FlexBox>
  );
};

export default ChartBanner;
