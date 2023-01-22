import React from 'react';
import { PrimaryText } from '@app/elements';
import { Colors } from '@app/utils';
import { View } from 'react-native';
import { FlexBox } from '@app/ui';

interface Props {
  props: {
    x: number;
    y: number;
    index: number;
    indexData: number;
  };
  isActive: boolean;
  data: {
    date: Date;
    value: number;
  }[];
}

const ExerciseChartItem = ({ props, isActive, data }: Props) => {
  const getDate = () => {
    const d = data.find((_, i) => i === props.index);
    if (d) {
      const { date } = d;
      return date.getMonth() + 1 + '/' + date.getDate();
    }
    return '';
  };

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
      top={props.y - 50}
      opacity={isActive ? 1 : 0}>
      <PrimaryText size="small" fontSize={10}>
        {getDate()}
      </PrimaryText>
      <PrimaryText size="small" fontSize={10} bold>
        {props.indexData}
      </PrimaryText>
    </FlexBox>
  );
};

export default ExerciseChartItem;
