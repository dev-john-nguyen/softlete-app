import { PrimaryText } from '@app/elements';
import { FlexBox } from '@app/ui';
import { normalize } from '@app/utils';
import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { ProgressCircle } from 'react-native-svg-charts';
import BaseColors, { rgba } from '../../utils/BaseColors';

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
  small,
}: Props) => {
  const circleSize = small ? normalize.width(6) : normalize.width(5);
  const circleWidth = small ? 7 : 8;
  return (
    <FlexBox alignItems="center" marginBottom={10} flexDirection="column">
      <ProgressCircle
        progress={progress}
        progressColor={progressColor}
        backgroundColor={rgba(BaseColors.whiteRbg, 0.2)}
        startAngle={0}
        cornerRadius={45}
        style={{
          height: circleSize,
          width: circleSize,
        }}
        strokeWidth={circleWidth}
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

export default HealthProgressItem;
