import React from 'react';
import { FlexBox } from '@app/ui';
import { ActivityIndicator } from 'react-native';
import BaseColors from '../../utils/BaseColors';
import PrimaryText from './PrimaryText';

interface Props {
  white?: boolean;
  size?: number | 'small' | 'large';
}

const Loading = ({ white = true, size = 'large' }: Props) => {
  return (
    <FlexBox column alignItems="center" justifyContent="center" flex={1}>
      <PrimaryText size="large" variant="primary" marginBottom={15}>
        Loading Data ...
      </PrimaryText>
      <ActivityIndicator
        size={size}
        color={white ? BaseColors.white : BaseColors.primary}
      />
    </FlexBox>
  );
};

export default Loading;
