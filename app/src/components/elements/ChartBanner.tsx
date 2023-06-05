import React, { useMemo } from 'react';
import { PrimaryText } from '@app/elements';
import { Colors } from '@app/utils';
import { FlexBox } from '@app/ui';

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
  const formattedDate = useMemo(() => {
    if (data && props.index < data.length) {
      const date = data[props.index];
      if (date) {
        return date.getMonth() + 1 + '/' + date.getDate();
      }
    }
    return '';
  }, [data, props]);

  return (
    <FlexBox
      column
      position="absolute"
      zIndex={100}
      borderColor={Colors.white}
      borderWidth={1}
      padding={10}
      paddingTop={5}
      paddingBottom={5}
      borderRadius={5}
      alignItems="center"
      left={props.x - 25}
      top={direction === 'top' ? props.y - 50 : props.y + 10}
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
