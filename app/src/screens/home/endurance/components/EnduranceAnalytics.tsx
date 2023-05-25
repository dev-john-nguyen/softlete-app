import { PrimaryText, ScreenTemplate } from '@app/elements';
import Icon from '@app/icons';
import { FlexBox } from '@app/ui';
import { Colors } from '@app/utils';
import React from 'react';

const EnduranceAnalytics = () => {
  return (
    <ScreenTemplate
      isBackVisible
      rotateBack="-90deg"
      leftContentFlex={0}
      middleContentFlex={1}
      middleContent={
        <FlexBox flex={1} marginLeft={10}>
          <PrimaryText size="large">Endurance</PrimaryText>
        </FlexBox>
      }
      rightContent={
        <FlexBox alignItems="center" justifyContent="flex-end" flex={1}>
          <Icon icon="target" color={Colors.white} size={20} />
        </FlexBox>
      }>
      <FlexBox></FlexBox>
    </ScreenTemplate>
  );
};

export default EnduranceAnalytics;
