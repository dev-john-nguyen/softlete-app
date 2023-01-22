import { PrimaryText } from '@app/elements';
import { FlexBox } from '@app/ui';
import { normalize } from '@app/utils';
import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { ProgressCircle } from 'react-native-svg-charts';
import BaseColors, { rgba } from '../../../utils/BaseColors';

interface Props {
  progress: number;
  progressColor: string;
  name: string;
  value: string;
  index: number;
  containerStyle?: StyleProp<ViewStyle>;
  small?: boolean;
}

const HealthProgressItem = ({
  progressColor,
  progress,
  name,
  value,
  index,
  containerStyle,
  small,
}: Props) => {
  return (
    <FlexBox alignItems="center" marginBottom={10} flexDirection="column">
      <ProgressCircle
        progress={progress}
        progressColor={progressColor}
        backgroundColor={rgba(BaseColors.whiteRbg, 0.2)}
        startAngle={0}
        cornerRadius={45}
        style={{
          height: normalize.width(5),
          width: normalize.width(5),
        }}
        strokeWidth={8}
      />
      <FlexBox flexDirection="column" alignItems="center" marginTop={5}>
        <PrimaryText size="medium" variant="secondary">
          {name}
        </PrimaryText>
        <FlexBox marginTop={2}>
          <PrimaryText size="small">{value}</PrimaryText>
        </FlexBox>
      </FlexBox>
    </FlexBox>
  );
};

const styles = StyleSheet.create({});

export default HealthProgressItem;
