import { PrimaryText } from '@app/elements';
import { FlexBox } from '@app/ui';
import { normalize } from '@app/utils';
import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { ProgressCircle } from 'react-native-svg-charts';
import BaseColors, { rgba } from '../../utils/BaseColors';
import Icon, { IconOptions } from '@app/icons';

interface Props {
  progress: number;
  progressColor: string;
  name: string;
  value: string;
  index: number;
  containerStyle?: StyleProp<ViewStyle>;
  small?: boolean;
  size?: number;
  circleWidth?: number;
  secondary?: boolean;
  icon?: IconOptions;
}

const HealthProgressItem = ({
  progressColor,
  progress,
  name,
  value,
  small,
  size,
  circleWidth: circleWidthProp,
  secondary,
  icon = 'checked',
}: Props) => {
  const circleSize = size
    ? size
    : small
    ? normalize.width(6)
    : normalize.width(5);
  const circleWidth = circleWidthProp ? circleWidthProp : small ? 7 : 8;

  if (secondary) {
    return (
      <FlexBox
        alignItems="center"
        marginBottom={10}
        flexDirection="column"
        position="relative"
        justifyContent="center">
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
        <FlexBox
          flexDirection="column"
          alignItems="center"
          marginTop={5}
          position="absolute">
          <Icon icon={icon} size={20} color={progressColor} />
          <FlexBox marginTop={2}>
            <PrimaryText size="small" color={progressColor}>
              {value}
            </PrimaryText>
          </FlexBox>
        </FlexBox>
      </FlexBox>
    );
  }

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
